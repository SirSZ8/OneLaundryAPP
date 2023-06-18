import { useEffect, useState } from "react";
import { Appbar, DataTable, Searchbar } from "react-native-paper";
import { ServicePelangganList } from "../../services/ServicePelanggan";
import _ from "lodash";
import { SafeAreaView, ScrollView } from "react-native";
import WidgetBaseLoader from "../../widgets/base/WidgetBaseLoader";
import WidgetBaseFABCreate from "../../widgets/base/WidgetBaseFABCreate";

const ScreenPelangganList = ({ navigation }) => {
  const [query, setQuery] = useState();
  const [complete, setComplete] = useState(false);
  const [daftarPelanggan, setDaftarPelanggan] = useState([]);
  const [pagination, setPagination] = useState({});

  const pelangganList = (page, terms) => {
    setComplete(false);
    const debounce = _.debounce(() => {
      ServicePelangganList(page, terms)
        .then(({ results, pagination }) => {
          setPagination(pagination);
          setDaftarPelanggan(results);
        })
        .catch((error) => console.log(error))
        .finally(() => setComplete(true));
    }, 500);

    debounce();
  };

  const paginate = (page) => {
    pelangganList(page, query);
  };

  const search = (e) => {
    pelangganList(1, e.nativeEvent.text);
  };

  const refresh = () => {
    setQuery("");
    pelangganList(1, "");
  };

  const openPelangganEdit = _.debounce((pelanggan) => {
    navigation.navigate("ScreenPelangganEdit", { pelanggan });
  }, 100);

  const openPelangganCreate = _.debounce(() => {
    navigation.navigate("ScreenPelangganCreate");
  }, 100);

  useEffect(() => {
    pelangganList();
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#537188" }}>
      <Appbar.Header>
        <Appbar.Action icon="menu" onPress={navigation.toggleDrawer} />
        <Appbar.Content title="Pelanggan" />
        <Appbar.Action icon="refresh" onPress={refresh} />
        {/* <Appbar.Action
          icon="arrow-left"
          disabled={_.isNull(pagination?.prev)}
          onPress={() => paginate(pagination?.prev)}
        />
        <Appbar.Action
          icon="arrow-right"
          disabled={_.isNull(pagination?.next)}
          onPress={() => paginate(pagination?.next)}
        /> */}
      </Appbar.Header>

      <ScrollView style={{ paddingBottom: 30 }}>
        {/* <Searchbar
          placeholder="Search"
          value={query || ""}
          onChangeText={(text) => setQuery(text)}
          onSubmitEditing={search}
          style={{ marginTop: 16, marginHorizontal: 16 }}
        /> */}

        <DataTable>
          <DataTable.Header style={{ borderBottomColor: "#9BA4B5" }}>
            {/* <DataTable.Title textStyle={{ color: "#fff" }}>
              Kode Pelanggan
            </DataTable.Title> */}
            <DataTable.Title textStyle={{ color: "#fff" }}>
              Nama Pelanggan
            </DataTable.Title>
            <DataTable.Title textStyle={{ color: "#fff", paddingLeft: 8 }}>
              Alamat
            </DataTable.Title>
            <DataTable.Title textStyle={{ color: "#fff" }}>
              Telepon Pelanggan
            </DataTable.Title>
          </DataTable.Header>

          {complete &&
            daftarPelanggan.map((pelanggan, index) => (
              <DataTable.Row
                key={index}
                onPress={() => openPelangganEdit(pelanggan)}
              >
                {/* <DataTable.Cell textStyle={{ color: "#fff" }}>
                  {pelanggan.kode_pelanggan}
                </DataTable.Cell> */}
                <DataTable.Cell textStyle={{ color: "#fff" }}>
                  {pelanggan.nama_pelanggan}
                </DataTable.Cell>
                <DataTable.Cell textStyle={{ color: "#fff" }}>
                  {pelanggan.alamat_pelanggan}
                </DataTable.Cell>
                <DataTable.Cell textStyle={{ color: "#fff" }}>
                  {pelanggan.telepon_pelanggan}
                </DataTable.Cell>
              </DataTable.Row>
            ))}
        </DataTable>
      </ScrollView>

      <WidgetBaseFABCreate action={() => openPelangganCreate()} />
      <WidgetBaseLoader complete={complete} />
    </SafeAreaView>
  );
};

export default ScreenPelangganList;

// import { useEffect, useState } from "react";
// import _ from "lodash";
// import ServicePelangganList from "../../services/ServicePelanggan";

// const ScreenPelangganList = ({ navigation }) => {
//   const [query, setQuery] = useState();
//   const [complete, setComplete] = useState(false);
//   const [daftarPelanggan, setDaftarPelanggan] = useState([]);
//   const [pagination, setPagination] = useState({});

//   const pelangganList = (page, terms) => {
//     setComplete(false);
//     const debounce = _.debounce(() => {
//       ServicePelangganList(page, terms)
//         .then(({ results, pagination }) => {
//           setDaftarPelanggan(results);
//           setPagination(pagination);
//         })
//         .catch((error) => console.log(error))
//         .finally(() => setComplete(true));
//     }, 500);

//     debounce();
//   };
//   const paginate = (page) => {
//     pelangganList(page, query);
//   };

//   const search = (e) => {
//     pelangganList(1, e.nativeEvent.text);
//   };

//   const refresh = () => {
//     setQuery("");
//     pelangganList(1, "");
//   };

//   const openPelangganEdit = _.debounce((pelanggan) => {
//     navigation.navigate("ScreenPelangganEdit", { pelanggan });
//   }, 100);

//   const openPelangganCreate = _.debounce(() => {
//     navigation.navigate("ScreenPelangganCreate");
//   }, 100);

//   useEffect(() => {
//     pelangganList();
//   }, []);
// };

// export default ScreenPelangganList;
