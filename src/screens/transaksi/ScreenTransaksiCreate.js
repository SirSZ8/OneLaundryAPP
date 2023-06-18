import _ from "lodash";
import {
  memo,
  useContext,
  useEffect,
  useState,
  useCallback,
  useMemo,
} from "react";
import SchemaTransaksi from "../../schema/SchemaTransaksi";
import {
  Appbar,
  Button,
  DataTable,
  Divider,
  List,
  TextInput,
} from "react-native-paper";
import { Alert, Platform, SafeAreaView, ScrollView, View } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import {
  ServiceBaseHumanDate,
  ServiceBaseHumanCurrency,
  ServiceBaseRandomID,
  ServiceBaseIsDuplicateArray,
  ServiceBaseFileSharing,
} from "../../services/ServiceBase";
import {
  ServiceTransaksiCreate,
  ServiceTransaksiShare,
} from "../../services/ServiceTransaksi";
import { ContextUserAuthentication } from "../../contexts/ContextUser";
import ScreenTransaksiStatusCucian from "./ScreenTransaksiStatusCucian";
import ScreenTransaksiPengembalian from "./ScreenTransaksiPengembalian";
import WidgetBarangChoice from "../../widgets/barang/WidgetBarangChoice";
import WidgetBaseLoader from "../../widgets/base/WidgetBaseLoader";
import SchemaPelanggan from "../../schema/SchemaPelanggan";
import WidgetPelangganChoice from "../../widgets/pelanggan/WidgetPelangganChoice";
import { SafeAreaProvider } from "react-native-safe-area-context";

const ScreenTransaksiCreate = memo(({ navigation }) => {
  const [transaksi, setTransaksi] = useState(SchemaTransaksi);
  const [complete, setComplete] = useState(false);
  const [daftarItemBarang, setDaftarItemBarang] = useState([]);
  const [pelanggan, setPelanggan] = useState(SchemaPelanggan);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [cucian, setCucian] = useState({});
  const [, setIsAuthenticated] = useContext(ContextUserAuthentication);
  const [pengembalian, setPengembalian] = useState();
  const [total, setTotal] = useState(0);

  const handleInput = (name, value) => {
    if (name === "tanggal_terima") setShowDatePicker(false);
    setTransaksi((values) => ({ ...values, [name]: value }));
  };

  const randomFaktur = () => {
    handleInput("no_faktur", ServiceBaseRandomID("TX"));
  };

  const handleInputItemBarang = (index, value, item) => {
    setDaftarItemBarang((values) => {
      const qty = parseInt(value);
      const items = [...values];

      if (qty === 0) {
        items.splice(index, 1);
      } else {
        items[index].qty = qty;
        items[index].subtotal = item.qty * item.hargaSatuan;
      }

      return items;
    });
  };

  const update = (item) => {
    const debounce = _.debounce(() => {
      setDaftarItemBarang((values) => {
        const items = [...values];
        const b = items.find((value) => value.kode_barang === item.kode_barang);
        const i = items.findIndex(
          (value) => value.kode_barang === item.kode_barang
        );
        b.qty = b.qty + 1;
        b.subtotal = b.qty * b.hargaSatuan;
        items[i] = b;
        return items;
      });
    }, 100);

    debounce();
  };

  const add = (item) => {
    const debounce = _.debounce(() => {
      const payload = {
        kode_barang: item.kode_barang,
        nama_barang: item.nama_barang,
        qty: 1,
        hargaSatuan: item.hargaSatuan,
        subtotal: 1 * item.hargaSatuan,
        // hargaBeli: item.hargaBeli,
        // jumlahBeli: 1,
        // subtotal: 1 * item.hargaBeli,
      };

      setDaftarItemBarang((values) => [...values, payload]);
    }, 100);

    debounce();
  };

  const addOrUpdate = useCallback(
    (item) => {
      const isDuplicate = ServiceBaseIsDuplicateArray(
        daftarItemBarang,
        item.kode_barang,
        "kode_barang"
      );
      if (isDuplicate) {
        update(item);
      } else {
        add(item);
      }
    },
    [daftarItemBarang]
  );

  const addPelanggan = (pelanggan) => {
    const debounce = _.debounce(() => setPelanggan(pelanggan), 100);
    debounce();
  };

  //     setDaftarItemBarang((values) => [...values, payload]);
  //   }, 100);
  // };

  const openTransaksiList = _.debounce(() => {
    navigation.navigate("ScreenTransaksiList");
  }, 100);

  const calculateTotal = useMemo(
    () => daftarItemBarang.length,
    [daftarItemBarang]
  );

  const calculateSubtotal = useMemo(() => {
    const total = _.sumBy(daftarItemBarang, "subtotal");
    handleInput("total", total);
    return total;
  }, [daftarItemBarang]);

  const calculateBayar = useMemo(() => {
    const kembalian = transaksi.dibayar - calculateSubtotal;
    handleInput("kembali", kembalian);
    return kembalian;
  }, [transaksi.dibayar, daftarItemBarang]);

  const askShare = () => {
    const actions = [
      {
        text: "Ya",
        onPress: transaksiShare,
      },
      {
        text: "Batal",
        onPress: () => {},
        style: "cancel",
      },
    ];
    Alert.alert("Share faktur?", null, actions);
  };

  const transaksiShare = () => {
    setComplete(false);

    const debounce = _.debounce(() => {
      ServiceTransaksiShare(transaksi.no_faktur)
        .then(async (blob) => {
          ServiceBaseFileSharing("NO_FAKTUR", blob);
          clear();
        })
        .catch((error) => console.log(error))
        .finally(() => setComplete(true));
    }, 500);

    debounce();
  };

  const transaksiCreate = () => {
    setComplete(false);

    const debounce = _.debounce(() => {
      transaksi.kode_pelanggan = pelanggan.kode_pelanggan;

      const payload = {
        ...transaksi,
        items: [...daftarItemBarang],
      };

      ServiceTransaksiCreate(payload)
        .then((data) => {
          // navigation.navigate("ScreenTransaksiBarangChoice");
          askShare();
        })
        .catch((error) => {
          console.log(error);
        })
        .finally(() => setComplete(true));
    }, 500);

    debounce();
  };

  // const openStatusCucian = _.debounce((item) => {
  //   setCucian(item);
  //   setIsAuthenticated(false);
  //   navigation.navigate("RouterTransaksi", {
  //     screen: "ScreenTransaksiStatusCucian",
  //   });
  // }, 100);

  // const openPengembalian = _.debounce(() => {
  //   setPengembalian();
  //   setIsAuthenticated(false);
  //   navigation.navigate("RouterTransaksi", {
  //     screen: "ScreenTransaksiPengembalian",
  //   });
  // }, 100);

  // const cucianPerkilo = () => {
  //   let jumlah = 0;
  //   if (beratKilo <= 1) {
  //     jumlah = 5000;
  //   } else {
  //     jumlah = 5000 + (beratKilo - 1) * 5000;
  //   }
  //   setHarga(jumlah);
  // };

  const clear = () => {
    setDaftarItemBarang([]);
    setPelanggan(SchemaPelanggan);
    setComplete(true);
    setTransaksi(SchemaTransaksi);
  };

  useEffect(() => {
    setComplete(false);
    const debounce = _.debounce(() => setComplete(true), 500);
    debounce();
  }, []);

  return (
    <SafeAreaProvider style={{ flex: 1, backgroundColor: "#7286d3" }}>
      <Appbar.Header>
        <Appbar.Action
          icon="menu"
          onPress={() => {
            navigation.toggleDrawer();
          }}
        />
        <Appbar.Content title="Buat Transaksi" />
        <Appbar.Action icon="trash-can-outline" onPress={clear} />
      </Appbar.Header>
      {complete && (
        <ScrollView
          style={{
            marginVertical: 8,
            marginHorizontal: 24,
          }}
          // contentContainerStyle={{ flex: 1, justifyContent: "center" }}
        >
          {/* <ScreenTransaksiStatusCucian onPress={openStatusCucian} /> */}
          {/* {transaksi.no_faktur && (
            <List.Item
              title={transaksi.nama_customer}
              description={transaksi.noTelepon}
            />
          )} */}
          {/* <Divider /> */}

          {/* <ScreenTransaksiPengembalian onPress={openPengembalian} />
          <Divider /> */}

          <View
            style={{
              marginVertical: 8,
              // flexDirection: "row",
              justifyContent: "center",
              gap: 16,
            }}
          >
            <Button
              buttonColor="#E8AA42"
              onPress={openTransaksiList}
              mode="contained"
            >
              Daftar Transaksi
            </Button>
            <TextInput
              // style={{ flex: 1 }}
              value={`${transaksi.no_faktur || ""}`}
              onChangeText={(text) => handleInput("no_faktur", text)}
              label="Nomor Faktur"
              editable={false}
              right={<TextInput.Icon onPress={randomFaktur} icon="reload" />}
            />

            <TextInput
              label="Tanggal"
              editable={false}
              value={`${ServiceBaseHumanDate(transaksi.tanggal_terima) || ""}`}
              right={
                <TextInput.Icon
                  onPress={() => setShowDatePicker(true)}
                  icon="calendar"
                />
              }
            />

            <Divider />

            {/* <TextInput
              style={{ flex: 1 }}
              value={transaksi.nama_customer || ""}
              onChangeText={(text) => handleInput("nama_customer", text)}
              label="Nama Pelanggan"
            /> */}
          </View>

          {/* <View style={{ marginVertical: 16 }}></View> */}
          {/* <Divider /> */}
          {showDatePicker && (
            <DateTimePicker
              value={transaksi.tanggal_terima || new Date()}
              mode="date"
              display={Platform.OS === "ios" ? "spinner" : "default"}
              is24Hour={true}
              onChange={(event, value) => handleInput("tanggal_terima", value)}
            />
          )}

          <WidgetPelangganChoice onPress={(item) => addPelanggan(item)} />
          {!_.isEmpty(pelanggan.kode_pelanggan) && (
            <List.Item
              titleStyle={{ color: "#fff" }}
              title={`${pelanggan.nama_pelanggan} | ${pelanggan.alamat_pelanggan} | ${pelanggan.telepon_pelanggan}`}
            />
          )}

          <WidgetBarangChoice onPress={(item) => addOrUpdate(item)} />
          {daftarItemBarang.map((barang, index) => (
            <View key={index}>
              <List.Item
                style={{ marginVertical: -16 }}
                key={index}
                titleStyle={{ color: "#fff" }}
                title={`${barang.nama_barang} ${barang.kode_barang}`}
                descriptionStyle={{ color: "#fff" }}
                description={ServiceBaseHumanCurrency(barang.hargaSatuan)}
                right={(props) => (
                  <>
                    <TextInput
                      key={index}
                      mode="outlined"
                      value={`${barang.qty || ""}`}
                      onChangeText={(text) =>
                        handleInputItemBarang(index, text, barang)
                      }
                    />
                  </>
                )}
              />
            </View>
          ))}

          <DataTable>
            <DataTable.Row>
              <DataTable.Title textStyle={{ color: "#fff" }}>
                Jumlah Barang
              </DataTable.Title>
              <DataTable.Cell textStyle={{ color: "#fff" }} numeric>
                {calculateTotal || 0} item
              </DataTable.Cell>
            </DataTable.Row>
            <DataTable.Row>
              <DataTable.Title textStyle={{ color: "#fff" }}>
                Total
              </DataTable.Title>
              <DataTable.Cell textStyle={{ color: "#fff" }} numeric>
                {ServiceBaseHumanCurrency(calculateSubtotal) || 0}
              </DataTable.Cell>
            </DataTable.Row>
            <DataTable.Row>
              <DataTable.Title textStyle={{ color: "#fff" }}>
                Kembali
              </DataTable.Title>
              <DataTable.Cell textStyle={{ color: "#fff" }} numeric>
                {ServiceBaseHumanCurrency(calculateBayar) || 0}
              </DataTable.Cell>
            </DataTable.Row>
          </DataTable>

          <View
            style={{
              // flexDirection: "row",
              // justifyContent: "center",
              gap: 8,
              marginVertical: 8,
            }}
          >
            <TextInput
              style={{ flex: 1 }}
              value={`${transaksi.dibayar || ""}`}
              error={calculateBayar < 0}
              onChangeText={(text) => handleInput("dibayar", parseInt(text))}
              label="Bayar"
              right={
                <TextInput.Icon
                  onPress={() => {
                    setTimeout(
                      () => handleInput("dibayar", calculateSubtotal),
                      100
                    );
                  }}
                  icon="auto-fix"
                />
              }
            />

            {/* <TextInput
              style={{ flex: 1 }}
              value={transaksi.berat || ""}
              onChangeText={(text) => handleInput("berat", parseInt(text))}
              label="PerKilo"
            /> */}
          </View>

          <View style={{ marginHorizontal: 16, gap: 16, marginVertical: 24 }}>
            <Button
              buttonColor="#3F3193"
              onPress={transaksiCreate}
              mode="contained"
              disabled={calculateBayar < 0}
            >
              Bayar
            </Button>

            {/* <Button
            mode="constained"
            onPress={() => {
              setIsAuthenticated(false);
              navigation.navigate("RouterTransaksi", {
                screen: "ScreenTransaksiStatusCucian",
              });
            }}
          >
            Status Cucian
          </Button> */}
          </View>
        </ScrollView>
      )}
      <WidgetBaseLoader complete={complete} />
      {/* <WidgetBaseFABList action={() => openTransaksiList()} /> */}
    </SafeAreaProvider>
  );
});

export default ScreenTransaksiCreate;
