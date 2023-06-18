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
import { ServiceItemBarangList } from "../../services/ServiceItemBarang";

const WidgetItemBarangChoice = ({ onPress }) => {
  const [daftarBarangTransaksi, setDaftarBarangTransaksi] = useState([]);
  const [complete, setComplete] = useState(false);
  const [visible, setVisible] = useState(false);

  const barangTransaksiList = () => {
    setComplete(false);

    const debounce = _.debounce(() => {
      ServiceItemBarangList() //ganti service
        .then(({ results }) => {
          setDaftarBarangTransaksi(results);
        })
        .catch((error) => {
          console.log(error);
        })
        .finally(() => setComplete(true));
    }, 500);

    debounce();
  };

  useEffect(() => {
    barangTransaksiList();
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
              <Appbar.Content title="Pilih Barang" />
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
                  </DataTable.Header>

                  {daftarBarang.map((barang, index) => (
                    <DataTable.Row
                      key={index}
                      onPress={() => {
                        _.debounce(() => {
                          onPress(barang);
                          setVisible(false);
                        }, 100)();
                      }}
                    >
                      <DataTable.Cell>{transaksi.no_faktur}</DataTable.Cell>
                      <DataTable.Cell>{barang.kode_barang}</DataTable.Cell>
                      <DataTable.Cell>{barang.nama_barang}</DataTable.Cell>
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
            title="Pilih Barang"
            titleStyle={{ color: "#fff" }}
            onPress={() => setVisible(true)}
            left={() => (
              <>
                {!complete && <ActivityIndicator animating={!complete} />}
                {complete && <List.Icon icon="cube-outline" />}
              </>
            )}
          ></List.Item>
        </List.Section>
      </Provider>
    </>
  );
};

export default WidgetItemBarangChoice;
