const { readToken } = require('../Config/encription');
const { salesReportControllers } = require('../Controllers');
const router = require('express').Router();

router.get('/getSalesByInvoice', readToken, salesReportControllers.getSalesByInvoice);
router.get('/getProfitHariIni', readToken, salesReportControllers.getProfitHariIni);
router.get('/getPenjualanHariIni', readToken, salesReportControllers.getPenjualanHariIni);
router.get('/getMenungguPembayaran', readToken, salesReportControllers.getMenungguPembayaran);
router.get('/getKonfirmasiPembayaran', readToken, salesReportControllers.getKonfirmasiPembayaran);
router.get('/getSedangProses', readToken, salesReportControllers.getSedangProses);
router.get('/getSedangDikirim', readToken, salesReportControllers.getSedangDikirim);
router.get('/getPesananTerkonfirmasi', readToken, salesReportControllers.getPesananTerkonfirmasi);
router.get('/getPesananDibatalkan', readToken, salesReportControllers.getPesananDibatalkan);
router.get('/getStockAkanHabis', readToken, salesReportControllers.getStockAkanHabis);
router.get('/getProfitMingguan', readToken, salesReportControllers.getProfitMingguan);
router.get('/getPenjualanObatMingguan', readToken, salesReportControllers.getPenjualanObatMingguan);
router.get('/getProfitBulanan', readToken, salesReportControllers.getProfitBulanan);
router.get('/getPenjualanObatBulanan', readToken, salesReportControllers.getPenjualanObatBulanan);

module.exports = router;