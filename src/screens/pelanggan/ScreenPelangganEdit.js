import { useEffect, useState } from "react";
import { Appbar, Button, TextInput } from "react-native-paper";
import {
  ServicePelangganDelete,
  ServicePelangganEdit,
} from "../../services/ServicePelanggan";
import { Alert, SafeAreaView, View } from "react-native";
import _ from "lodash";
import WidgetBaseLoader from "../../widgets/base/WidgetBaseLoader";
import { ScrollView } from "react-native-gesture-handler";

const ScreenPelangganEdit = ({ navigation, route }) => {
  const [complete, setComplete] = useState(false);
  const [pelanggan, setPelanggan] = useState({});

  const handleInput = (name, value) => {
    setPelanggan((values) => ({ ...values, [name]: value }));
  };

  const pelangganEdit = () => {
    setComplete(false);
    const debounce = _.debounce(() => {
      ServicePelangganEdit(pelanggan)
        .then(() => {
          Alert.alert("Notifikasi", "Berhasil");
          navigation.goBack();
        })
        .catch((error) => {
          console.log(error);
        })
        .finally(() => setComplete(true));
    }, 1000);

    debounce();
  };

  const askDelete = () => {
    const actions = [
      {
        text: "Ya",
        onPress: () => pelangganDelete(),
      },
      {
        text: "Batal",
        style: "cancel",
      },
    ];

    Alert.alert("Konfirmasi", "Ingin dihapus?", actions);
  };

  const pelangganDelete = () => {
    const debounce = _.debounce(() => {
      ServicePelangganDelete(pelanggan.kode_pelanggan)
        .then(() => {
          Alert.alert("Notifikasi", "Berhasil");
          navigation.goBack();
        })
        .catch((error) => {
          console.log(error);
        });
    }, 100);

    debounce();
  };

  useEffect(() => {
    setComplete(false);
    const debounce = _.debounce(() => {
      setPelanggan(route.params.pelanggan);
      setComplete(true);
    }, 1000);
    debounce();
  }, [route.params.pelanggan]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#7286d3" }}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="Edit Pelanggan" />
        <Appbar.Action icon="trash-can-outline" onPress={askDelete} />
      </Appbar.Header>

      {complete && (
        <ScrollView
          style={{
            marginVertical: 24,
            marginHorizontal: 24,
          }}
        >
          <View style={{ gap: 24 }}>
            <TextInput
              value={pelanggan.kode_pelanggan || ""}
              onChangeText={(text) => handleInput("kode_pelanggan", text)}
              label="Kode Pelanggan"
              disabled
            />
            <TextInput
              value={pelanggan.nama_pelanggan || ""}
              onChangeText={(text) => handleInput("nama_pelanggan", text)}
              label="Nama Pelanggan"
            />
            <TextInput
              value={pelanggan.alamat_pelanggan || ""}
              onChangeText={(text) => handleInput("alamat_pelanggan", text)}
              label="Alamat Pelanggan"
            />
            <TextInput
              value={pelanggan.telepon_pelanggan || ""}
              onChangeText={(text) => handleInput("telepon_pelanggan", text)}
              label="Telepon Pelanggan"
            />
            {/* <TextInput
              value={`${pemasok.hargaBeli || ""}`}
              onChangeText={(text) => handleInput("hargaBeli", parseInt(text))}
              keyboardType={"numeric"}
              label="Harga Beli"
            />

            <TextInput
              value={`${pemasok.hargaJual || ""}`}
              onChangeText={(text) => handleInput("hargaJual", parseInt(text))}
              keyboardType={"numeric"}
              label="Harga Jual"
            />

            <TextInput
              value={`${pemasok.jumlahPemasok || ""}`}
              onChangeText={(text) =>
                handleInput("jumlahPemasok", parseInt(text))
              }
              keyboardType={"numeric"}
              label="Jumlah Pemasok"
            /> */}

            <Button
              onPress={pelangganEdit}
              mode="contained"
              style={{ backgroundColor: "#3F3193" }}
            >
              Simpan Perubahan
            </Button>
          </View>
        </ScrollView>
      )}
      <WidgetBaseLoader complete={complete} />
    </SafeAreaView>
  );
};

export default ScreenPelangganEdit;
