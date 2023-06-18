import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ScreenTransaksiCreate from "../screens/transaksi/ScreenTransaksiCreate";
import ScreenTransaksiList from "../screens/transaksi/ScreenTransaksiList";
import ScreenTransaksiDetail from "../screens/transaksi/ScreenTransaksiDetail";
import ScreenTransaksiReporting from "../screens/laporan/ScreenLaporanTransaksi";

const Stack = createNativeStackNavigator();

export const RouterTransaksiAuthenticated = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="ScreenTransaksiCreate"
        component={ScreenTransaksiCreate}
      />
      <Stack.Screen
        name="ScreenTransaksiList"
        component={ScreenTransaksiList}
      />
      <Stack.Screen
        name="ScreenTransaksiDetail"
        component={ScreenTransaksiDetail}
      />
      <Stack.Screen
        name="ScreenTransaksiReporting"
        component={ScreenTransaksiReporting}
      />
      {/* <Stack.Screen
        name="ScreenTransaksiBarangChoice"
        component={ScreenTransaksiBarangChoice}
      />
      <Stack.Screen
        name="ScreenTransaksiPembayaran"
        component={ScreenTransaksiPembayaran}
      />
      <Stack.Screen
        name="ScreenTransaksiStatusCucian"
        component={ScreenTransaksiStatusCucian}
      />
      <Stack.Screen
        name="ScreenTransaksiDone"
        component={ScreenTransaksiDone}
      />
      <Stack.Screen
        name="ScreenTransaksiPengembalian"
        component={ScreenTransaksiPengembalian}
      /> 
      */}
    </Stack.Navigator>
  );
};
