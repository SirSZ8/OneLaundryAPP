import { memo, useEffect, useState } from "react";
import {
  ServiceTransaksiDetail,
  ServiceTransaksiPrint,
} from "../../services/ServiceTransaksi";
import { Alert, SafeAreaView, ScrollView, View } from "react-native";
import { Appbar, Divider, List, Text } from "react-native-paper";
import SchemaTransaksi from "../../schema/SchemaTransaksi";
import {
  ServiceBaseFileSharing,
  ServiceBaseHumanCurrency,
  ServiceBaseHumanDate,
} from "../../services/ServiceBase";
import _ from "lodash";
import WidgetBaseLoader from "../../widgets/base/WidgetBaseLoader";

const ScreenTransaksiDetail = memo(({ navigation, route }) => {
  const [complete, setComplete] = useState(false);
  const [transaksi, setTransaksi] = useState(SchemaTransaksi);
  const [daftarItemBarang, setDaftarItemBarang] = useState([]);

  const askShare = () => {
    const actions = [
      {
        text: "Ya",
        onPress: transaksiPrint,
      },
      {
        text: "Kembali",
        onPress: () => navigation.goBack(),
        style: "cancel",
      },
    ];

    Alert.alert("Cetak Faktur?", null, actions);
  };

  const transaksiPrint = () => {
    setComplete(false);
    const debounce = _.debounce(() => {
      ServiceTransaksiPrint(transaksi.no_faktur)
        .then((blob) => {
          ServiceBaseFileSharing("NO_FAKTUR", blob);
          Alert.alert("Notifikasi", "Berhasil");
        })
        .catch((error) => {
          console.log(error);
        })
        .finally(() => {
          setComplete(true);
          navigation.goBack();
        });
    }, 1000);

    debounce();
  };

  useEffect(() => {
    setComplete(false);
    const debounce = _.debounce(() => {
      ServiceTransaksiDetail(route.params.no_faktur)
        .then(({ transaksi, items }) => {
          setTransaksi(transaksi);
          setDaftarItemBarang(items);
        })
        .catch(() => {})
        .finally(() => setComplete(true));
    }, 1000);

    debounce();
  }, [route.params.no_faktur]);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="Detail Transaksi" />
        <Appbar.Action
          icon="share-variant-outline"
          onPress={() => askShare()}
        />
      </Appbar.Header>
      {complete && (
        <ScrollView>
          <List.Section>
            <List.Subheader>Transaksi</List.Subheader>
            <List.Item
              title="No. Faktur"
              right={() => <Text>{transaksi.no_faktur}</Text>}
            />
            <List.Item
              title="Tanggal Transaksi"
              right={() => (
                <Text>{ServiceBaseHumanDate(transaksi.tanggal_terima)}</Text>
              )}
            />
            <List.Item
              title="Kode Pelanggan"
              right={() => <Text>{transaksi.kode_pelanggan}</Text>}
            />
          </List.Section>
          <Divider />
          <List.Section>
            <List.Subheader>Daftar Item</List.Subheader>
            {daftarItemBarang.map((item, index) => (
              <View key={index}>
                <List.Item
                  title={item.nama_barang}
                  description={item.kode_barang}
                  right={() => {
                    return (
                      <Text>{ServiceBaseHumanCurrency(item.subtotal)}</Text>
                    );
                  }}
                />
              </View>
            ))}
          </List.Section>
          <Divider />
          <List.Section>
            <List.Subheader>Pembayaran</List.Subheader>
            <List.Item
              title="Total"
              right={() => (
                <Text variant="titleLarge">
                  {ServiceBaseHumanCurrency(transaksi.total)}
                </Text>
              )}
            />
            <List.Item
              title="Dibayar"
              right={() => (
                <Text variant="titleLarge">
                  {ServiceBaseHumanCurrency(transaksi.dibayar)}
                </Text>
              )}
            />
            <List.Item
              title="Kembali"
              right={() => (
                <Text>{ServiceBaseHumanCurrency(transaksi.kembali)}</Text>
              )}
            />
          </List.Section>
        </ScrollView>
      )}
      <WidgetBaseLoader complete={complete} />
    </SafeAreaView>
  );
});

export default ScreenTransaksiDetail;
