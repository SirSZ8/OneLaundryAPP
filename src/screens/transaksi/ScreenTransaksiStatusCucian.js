export default ScreenTransaksiStatusCucian;
import _ from "lodash";
import { useState, useEffect } from "react";
import { Modal, ScrollView } from "react-native";
import {
  ActivityIndicator,
  Appbar,
  DataTable,
  List,
  Portal,
  Provider,
  Searchbar,
} from "react-native-paper";
import WidgetBaseLoader from "../base/WidgetBaseLoader";
import { ServiceBarangList } from "../../services/ServiceBarang";

const ScreenTransaksiStatusCucian = ({ navigation }) => {
  const [daftarCucian, setDaftarCucian] = useState([]);
  const [complete, setComplete] = useState(false);
  const [visible, setVisible] = useState(false);
  const [items, setItems] = useState([]);

  const cucianList = () => {
    setComplete(false);

    const debounce = _.debounce(() => {
      ServiceTransaksiList()
        .then(({ results }) => {
          setDaftarCucian(results);
        })
        .catch((error) => {
          console.log(error);
        })
        .finally(() => setComplete(true));
    }, 500);

    debounce();
  };

  const item = {
    no_faktur: transaksi.no_faktur,
    kode_barang: barang.kode_barang,
    nama_barang: barang.nama_barang,
    status_cucian: transaksi.status_cucian,
  };

  useEffect(() => {
    cucianList();
  }, []);

  return (
    <>
      <Provider>
        <Portal>
          <Modal
            animationType="fade"
            style={{ backgroundColor: "#ffffff" }}
            visible={visible}
          >
            <Appbar.Header>
              <Appbar.Action
                icon="arrow-left"
                onPress={() => setVisible(false)}
              />
              <Appbar.Content title="Status Cucian" />
            </Appbar.Header>

            {complete && (
              <ScrollView
                contentContainerStyle={{
                  paddingBottom: 24,
                }}
              >
                <Searchbar
                  placeholder="Search"
                  onChangeText={(text) => {}}
                  onSubmitEdit={() => {}}
                  style={{
                    marginHorizontal: 16,
                    marginVertical: 16,
                  }}
                />

                <DataTable>
                  <DataTable.Header>
                    <DataTable.Title>Nomor Faktur</DataTable.Title>
                    <DataTable.Title>Kode Barang</DataTable.Title>
                    <DataTable.Title>Nama Barang</DataTable.Title>
                    <DataTable.Title>Status</DataTable.Title>
                  </DataTable.Header>

                  {daftarCucian.map((item, index) => (
                    <DataTable.Row
                      key={index}
                      onPress={() => {
                        _.debounce(() => {
                          onPress(item);
                          setVisible(false);
                        }, 100)();
                      }}
                    >
                      <DataTable.Cell>{item.no_faktur}</DataTable.Cell>
                      <DataTable.Cell>{item.kode_barang}</DataTable.Cell>
                      <DataTable.Cell>{item.nama_barang}</DataTable.Cell>
                    </DataTable.Row>
                  ))}
                </DataTable>
              </ScrollView>
            )}
            <WidgetBaseLoader complete={complete} />
          </Modal>
        </Portal>

        <List.Section style={{ paddingHorizontal: 16 }}>
          <List.Item
            title="Status Cucian"
            onPress={() => setVisible(true)}
            left={() => (
              <>
                {!complete && <ActivityIndicator animating={!complete} />}
                {complete && <List.Icon icon="diswasher" />}
              </>
            )}
          ></List.Item>
        </List.Section>
      </Provider>
    </>
  );
};
