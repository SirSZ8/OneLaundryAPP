import { ServiceBaseRandomID } from "../services/ServiceBase";

export default {
  no_faktur: ServiceBaseRandomID("TX"),
  tanggal_terima: new Date(),
  total: 0,
  dibayar: 0,
  kembali: 0,
  kode_pelanggan: "",
  items: [],
  // status_cucian: "",
  // status_pengembalian: "",
};
