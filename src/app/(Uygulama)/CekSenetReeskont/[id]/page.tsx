"use client";

import PageContainer from "@/app/(Uygulama)/components/Container/PageContainer";
import Breadcrumb from "@/app/(Uygulama)/components/Layout/Breadcrumb/Breadcrumb";
import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Divider,
  Grid,
  IconButton,
  MenuItem,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import CekSenetReeskontVeriYukleme from "./CekSenetReeskontVeriYukleme";
import {
  deleteBaglantiBilgileriById,
  getBaglantiBilgileriByLink,
} from "@/api/BaglantiBilgileri/BaglantiBilgileri";
import { usePathname } from "next/navigation";
import Forbidden from "@/app/forbidden";
import { enqueueSnackbar } from "notistack";
import { useSelector } from "@/store/hooks";
import { AppState } from "@/store/store";
import { TamamlaPopUp } from "@/app/(Uygulama)/components/PopUps/TamamlaPopUp";
import { IconX } from "@tabler/icons-react";
import CustomFormLabel from "@/app/(Uygulama)/components/Forms/ThemeElements/CustomFormLabel";
import CustomTextField from "@/app/(Uygulama)/components/Forms/ThemeElements/CustomTextField";
import CustomSelect from "@/app/(Uygulama)/components/Forms/ThemeElements/CustomSelect";
import {
  createCekSenetReeskontEkBilgi,
  getCekSenetReeskontEkBilgi,
  getCekSenetReeskontIskontoOranlari,
} from "@/api/Veri/CekSenetReeskont";

interface Veri {
  id: number;
  denetciId: number;
  denetlenenId: number;
  denetlenenFirmaAdi: string;
  kullaniciId: number;
  yil: number;
  link: string;
  baslangicTarihi: string;
  bitisTarihi: string;
  tip: string;
}

const Page: React.FC = () => {
  const smDown = useMediaQuery((theme: any) => theme.breakpoints.down("sm"));

  const customizer = useSelector((state: AppState) => state.customizer);
  const theme = useTheme();

  const [showDrawer, setShowDrawer] = React.useState(false);
  const handleDrawerClose = () => {
    setShowDrawer(false);
  };

  const [oran, setOran] = useState("TCMB");
  const handleChangeOran = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setOran(event.target.value);
    await fetchDataIskontoOranlari(event.target.value);
  };

  const [kacGun, setKacGun] = useState(365);
  const handleChangeKacGun = (event: React.ChangeEvent<HTMLInputElement>) => {
    setKacGun(parseInt(event.target.value));
  };

  const [vukAlinan, setVukAlinan] = useState<number>(0);
  const [vukVerilen, setVukVerilen] = useState<number>(0);
  const [iskontoOrani130, setIskontoOrani130] = useState<number>(0);
  const [iskontoOrani3090, setIskontoOrani3090] = useState<number>(0);
  const [iskontoOrani90180, setIskontoOrani90180] = useState<number>(0);
  const [iskontoOrani180365, setIskontoOrani180365] = useState<number>(0);
  const [iskontoOrani365, setIskontoOrani365] = useState<number>(0);

  const pathname = usePathname();

  const [control, setControl] = useState(true);

  const [fetchedData, setFetchedData] = useState<Veri | null>(null);

  const [kaydetTiklandimi, setKaydetTiklandimi] = useState(false);
  const [tamamlaTiklandimi, setTamamlaTiklandimi] = useState(false);

  const [sonKaydedilmeTarihi, setSonKaydedilmeTarihi] = useState("");

  const [isTamamlaPopUpOpen, setIsTamamlaPopUpOpen] = useState(false);

  const handleCloseTamamlaPopUp = () => {
    setIsTamamlaPopUpOpen(false);
  };

  const handleSave = async () => {
    const createdCekSenetReeskontEkBilgi = {
      denetciId: fetchedData?.denetciId,
      yil: fetchedData?.yil,
      denetlenenId: fetchedData?.denetlenenId,
      vukAlinan: vukAlinan,
      vukVerilen: vukVerilen,
      oran: oran,
      kacGun: kacGun,
      iskontoOrani130: iskontoOrani130,
      iskontoOrani3090: iskontoOrani3090,
      iskontoOrani90180: iskontoOrani90180,
      iskontoOrani180365: iskontoOrani180365,
      iskontoOrani365: iskontoOrani365,
    };
    try {
      const result = await createCekSenetReeskontEkBilgi(
        "",
        createdCekSenetReeskontEkBilgi
      );
      if (result) {
        handleDrawerClose();
        enqueueSnackbar("Ek Bilgiler Kaydedildi", {
          variant: "success",
          autoHideDuration: 5000,
          style: {
            backgroundColor:
              customizer.activeMode === "dark"
                ? theme.palette.success.light
                : theme.palette.success.main,
            maxWidth: "720px",
          },
        });
      } else {
        enqueueSnackbar("Ek Bilgiler Kaydedilemedi", {
          variant: "error",
          autoHideDuration: 5000,
          style: {
            backgroundColor:
              customizer.activeMode === "dark"
                ? theme.palette.error.light
                : theme.palette.error.main,
            maxWidth: "720px",
          },
        });
      }
    } catch (error) {
      console.error("Bir hata oluştu:", error);
    }
  };

  const handleTamamla = async () => {
    try {
      const result = await deleteBaglantiBilgileriById(
        "",
        fetchedData?.denetciId || 0,
        fetchedData?.denetlenenId || 0,
        fetchedData?.kullaniciId || 0,
        fetchedData?.yil || 0,
        fetchedData ? fetchedData.id : 0
      );
      if (result) {
        setTamamlaTiklandimi(true);
        enqueueSnackbar("Tamamlandı", {
          variant: "success",
          autoHideDuration: 5000,
          style: {
            backgroundColor:
              customizer.activeMode === "dark"
                ? theme.palette.success.light
                : theme.palette.success.main,
            maxWidth: "720px",
          },
        });
      } else {
        setTamamlaTiklandimi(false);
        enqueueSnackbar("Tamamlanamadı", {
          variant: "error",
          autoHideDuration: 5000,
          style: {
            backgroundColor:
              customizer.activeMode === "dark"
                ? theme.palette.error.light
                : theme.palette.error.main,
            maxWidth: "720px",
          },
        });
      }
    } catch (error) {
      console.error("Bir hata oluştu:", error);
    }
  };

  const fetchData = async () => {
    try {
      const baglantiBilgisi = await getBaglantiBilgileriByLink(
        `http://betaverigirisi.fasmart.app${pathname}`
      );
      if (baglantiBilgisi != undefined) {
        // Tarihleri "DD.MM.YYYY HH:mm" formatında ayarlama
        const formatDateTime = (dateTimeStr?: string) => {
          if (!dateTimeStr) return "";
          const date = new Date(dateTimeStr);
          const pad = (n: number) => n.toString().padStart(2, "0");
          return `${pad(date.getDate())}.${pad(
            date.getMonth() + 1
          )}.${date.getFullYear()} ${pad(date.getHours())}:${pad(
            date.getMinutes()
          )}`;
        };

        const newRow: Veri = {
          id: baglantiBilgisi.id,
          denetciId: baglantiBilgisi.denetciId,
          denetlenenId: baglantiBilgisi.denetlenenId,
          denetlenenFirmaAdi: baglantiBilgisi.denetlenenFirmaAdi,
          kullaniciId: baglantiBilgisi.kullaniciId,
          yil: baglantiBilgisi.yil,
          link: baglantiBilgisi.link,
          baslangicTarihi: formatDateTime(baglantiBilgisi.baslangicTarihi),
          bitisTarihi: formatDateTime(baglantiBilgisi.bitisTarihi),
          tip: baglantiBilgisi.tip,
        };
        setFetchedData(newRow);
      } else {
        setFetchedData(null);
        setControl(false);
      }
    } catch (error) {
      console.error("Bir hata oluştu:", error);
      setControl(false);
    }
  };

  const fetchDataEkbilgi = async () => {
    try {
      const cekSenetReeskontEkBilgiVerileri = await getCekSenetReeskontEkBilgi(
        "",
        fetchedData?.denetciId || 0,
        fetchedData?.yil || 0,
        fetchedData?.denetlenenId || 0
      );
      if (cekSenetReeskontEkBilgiVerileri) {
        setVukAlinan(cekSenetReeskontEkBilgiVerileri.vukAlinan);
        setVukVerilen(cekSenetReeskontEkBilgiVerileri.vukVerilen);
        setOran(cekSenetReeskontEkBilgiVerileri.oran);
        setKacGun(cekSenetReeskontEkBilgiVerileri.kacGun);
        setIskontoOrani130(cekSenetReeskontEkBilgiVerileri.iskontoOrani130);
        setIskontoOrani3090(cekSenetReeskontEkBilgiVerileri.iskontoOrani3090);
        setIskontoOrani90180(cekSenetReeskontEkBilgiVerileri.iskontoOrani90180);
        setIskontoOrani180365(
          cekSenetReeskontEkBilgiVerileri.iskontoOrani180365
        );
        setIskontoOrani365(cekSenetReeskontEkBilgiVerileri.iskontoOrani365);
      } else {
        await fetchDataIskontoOranlari("TCMB");
      }
    } catch (error) {
      console.error("Bir hata oluştu:", error);
    }
  };

  const fetchDataIskontoOranlari = async (oranAdi: string) => {
    try {
      const cekSenetReeskontIskontoOranlariVerileri =
        await getCekSenetReeskontIskontoOranlari(
          "",
          oranAdi,
          fetchedData?.yil || 0
        );
      if (cekSenetReeskontIskontoOranlariVerileri) {
        setIskontoOrani130(
          cekSenetReeskontIskontoOranlariVerileri.iskontoOrani130
        );
        setIskontoOrani3090(
          cekSenetReeskontIskontoOranlariVerileri.iskontoOrani3090
        );
        setIskontoOrani90180(
          cekSenetReeskontIskontoOranlariVerileri.iskontoOrani90180
        );
        setIskontoOrani180365(
          cekSenetReeskontIskontoOranlariVerileri.iskontoOrani180365
        );
        setIskontoOrani365(
          cekSenetReeskontIskontoOranlariVerileri.iskontoOrani365
        );
      }
    } catch (error) {
      console.error("Bir hata oluştu:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (fetchedData) {
      fetchDataEkbilgi();
    }
  }, [fetchedData]);

  return control ? (
    <PageContainer
      title="Çek / Senet Reeskont"
      description="Çek / Senet Reeskont"
    >
      <Breadcrumb
        title="Çek / Senet Reeskont Veri Giriş Ekranı"
        subtitle={
          fetchedData
            ? `${fetchedData.denetlenenFirmaAdi} ⚬ ${fetchedData.yil}`
            : undefined
        }
        note={
          fetchedData
            ? `Bağlantı Son Geçerlilik Tarihi: ${fetchedData.bitisTarihi}`
            : undefined
        }
      />
      <Grid container>
        <Grid item xs={12} lg={12}>
          {fetchedData != null && (
            <Grid container>
              <Grid
                item
                xs={12}
                lg={12}
                sx={{
                  display: "flex",
                  flexDirection: smDown ? "column" : "row",
                  alignItems: "center",
                  justifyContent: "flex-end",
                  mb: 2,
                  gap: 1,
                }}
              >
                {sonKaydedilmeTarihi && (
                  <Typography
                    variant={"body2"}
                    textAlign={"center"}
                    sx={{ mb: smDown ? 1 : 0 }}
                  >
                    Son Kaydedilme: {sonKaydedilmeTarihi}
                  </Typography>
                )}
                <Box flex={1}></Box>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: smDown ? "column" : "row",
                    gap: 1,
                    width: smDown ? "100%" : "auto",
                  }}
                >
                  <Button
                    type="button"
                    size="medium"
                    disabled={kaydetTiklandimi || tamamlaTiklandimi}
                    variant="outlined"
                    color="primary"
                    onClick={() => setShowDrawer(true)}
                  >
                    Ek Bilgi
                  </Button>
                  <Button
                    type="button"
                    size="medium"
                    disabled={kaydetTiklandimi || tamamlaTiklandimi}
                    variant="outlined"
                    color="primary"
                    onClick={() => {
                      setKaydetTiklandimi(true);
                    }}
                  >
                    Kaydet
                  </Button>
                  <Button
                    type="button"
                    size="medium"
                    disabled={kaydetTiklandimi || tamamlaTiklandimi}
                    variant="outlined"
                    color="success"
                    onClick={() => {
                      setIsTamamlaPopUpOpen(true);
                    }}
                  >
                    Tamamla
                  </Button>
                </Box>
              </Grid>
              <Grid item xs={12} lg={12}>
                <CekSenetReeskontVeriYukleme
                  denetciId={fetchedData?.denetciId}
                  denetlenenId={fetchedData?.denetlenenId}
                  yil={fetchedData?.yil}
                  kaydetTiklandimi={kaydetTiklandimi}
                  setKaydetTiklandimi={setKaydetTiklandimi}
                  setSonKaydedilmeTarihi={setSonKaydedilmeTarihi}
                />
              </Grid>
            </Grid>
          )}
        </Grid>
        <Dialog
          open={showDrawer}
          onClose={() => setShowDrawer(false)}
          maxWidth={"md"}
        >
          <DialogContent className="testdialog" sx={{ overflow: "visible" }}>
            <Stack
              direction="row"
              spacing={2}
              justifyContent={"space-between"}
              alignItems="center"
            >
              <Typography variant="h5" p={1}>
                Ek Bilgiler
              </Typography>
              <IconButton size="small" onClick={handleDrawerClose}>
                <IconX size="18" />
              </IconButton>
            </Stack>
          </DialogContent>
          <Divider />
          <DialogContent>
            <Grid container>
              <Grid
                item
                xs={12}
                lg={12}
                sx={{
                  display: "flex",
                  alignContent: "center",
                  justifyContent: "space-between",
                }}
              >
                <Grid item xs={12} lg={6}>
                  <CustomFormLabel
                    htmlFor="vukAlinan"
                    sx={{ mt: 0, mb: { xs: "-10px", sm: 0 }, mr: 2 }}
                  >
                    <Typography variant="h6" p={1}>
                      Vuk Alınan
                    </Typography>
                  </CustomFormLabel>
                </Grid>
                <Grid item xs={12} lg={6}>
                  <CustomTextField
                    id="vukAlinan"
                    type="number"
                    fullWidth
                    value={vukAlinan}
                    onChange={(e: any) =>
                      setVukAlinan(parseFloat(e.target.value))
                    }
                  />
                </Grid>
              </Grid>
              <Grid
                item
                xs={12}
                lg={12}
                sx={{
                  display: "flex",
                  alignContent: "center",
                  justifyContent: "space-between",
                  mt: 1,
                }}
              >
                <Grid item xs={12} lg={6}>
                  <CustomFormLabel
                    htmlFor="vukVerilen"
                    sx={{ mt: 0, mb: { xs: "-10px", sm: 0 }, mr: 2 }}
                  >
                    <Typography variant="h6" p={1}>
                      Vuk Verilen
                    </Typography>
                  </CustomFormLabel>
                </Grid>
                <Grid item xs={12} lg={6}>
                  <CustomTextField
                    id="vukVerilen"
                    type="number"
                    fullWidth
                    value={vukVerilen}
                    onChange={(e: any) =>
                      setVukVerilen(parseFloat(e.target.value))
                    }
                  />
                </Grid>
              </Grid>
              <Grid
                item
                xs={12}
                lg={12}
                sx={{
                  display: "flex",
                  alignContent: "center",
                  justifyContent: "space-between",
                  mt: 1,
                }}
              >
                <Grid item xs={12} lg={6}>
                  <CustomFormLabel
                    htmlFor="oran"
                    sx={{ mt: 0, mb: { xs: "-10px", sm: 0 }, mr: 2 }}
                  >
                    <Typography variant="h6" p={1}>
                      TL İçin Kullanmak İstediğiniz Oranı Seçin
                    </Typography>
                  </CustomFormLabel>
                </Grid>
                <Grid item xs={12} lg={6}>
                  <CustomSelect
                    labelId="oran"
                    id="oran"
                    size="medium"
                    fullWidth
                    value={oran}
                    onChange={handleChangeOran}
                  >
                    <MenuItem value={"TCMB"}>TCMB Avans Oranı</MenuItem>
                    <MenuItem value={"TRL/TLREF"}>TLREF</MenuItem>
                  </CustomSelect>
                </Grid>
              </Grid>
              <Grid
                item
                xs={12}
                lg={12}
                sx={{
                  display: "flex",
                  alignContent: "center",
                  justifyContent: "space-between",
                  mt: 1,
                }}
              >
                <Grid item xs={12} lg={6}>
                  <CustomFormLabel
                    htmlFor="kacGun"
                    sx={{ mt: 0, mb: { xs: "-10px", sm: 0 }, mr: 2 }}
                  >
                    <Typography variant="h6" p={1}>
                      Bir Yıl Kaç Gün Olarak Hesaplansın?
                    </Typography>
                  </CustomFormLabel>
                </Grid>
                <Grid item xs={12} lg={6}>
                  <CustomSelect
                    labelId="kacGun"
                    id="kacGun"
                    size="medium"
                    fullWidth
                    value={kacGun}
                    onChange={handleChangeKacGun}
                  >
                    <MenuItem value={365}>365</MenuItem>
                    <MenuItem value={360}>360</MenuItem>
                  </CustomSelect>
                </Grid>
              </Grid>
              <Grid
                item
                xs={12}
                lg={12}
                sx={{
                  display: "flex",
                  alignContent: "center",
                  justifyContent: "space-between",
                  mt: 2,
                }}
              >
                <Grid item xs={12} lg={6}>
                  <CustomFormLabel
                    htmlFor="iskonto130"
                    sx={{ mt: 0, mb: { xs: "-10px", sm: 0 }, mr: 2 }}
                  >
                    <Typography variant="h6" p={1}>
                      İskonto Oranı: 1 - 30 Gün
                    </Typography>
                  </CustomFormLabel>
                </Grid>
                <Grid item xs={12} lg={6}>
                  <CustomTextField
                    id="iskonto130"
                    type="number"
                    fullWidth
                    value={iskontoOrani130}
                    onChange={(e: any) =>
                      setIskontoOrani130(parseFloat(e.target.value))
                    }
                  />
                </Grid>
              </Grid>
              <Grid
                item
                xs={12}
                lg={12}
                sx={{
                  display: "flex",
                  alignContent: "center",
                  justifyContent: "space-between",
                  mt: 2,
                }}
              >
                <Grid item xs={12} lg={6}>
                  <CustomFormLabel
                    htmlFor="iskonto3090"
                    sx={{ mt: 0, mb: { xs: "-10px", sm: 0 }, mr: 2 }}
                  >
                    <Typography variant="h6" p={1}>
                      İskonto Oranı: 30 - 90 Gün
                    </Typography>
                  </CustomFormLabel>
                </Grid>
                <Grid item xs={12} lg={6}>
                  <CustomTextField
                    id="iskonto3090"
                    type="number"
                    fullWidth
                    value={iskontoOrani130}
                    onChange={(e: any) =>
                      setIskontoOrani3090(parseFloat(e.target.value))
                    }
                  />
                </Grid>
              </Grid>
              <Grid
                item
                xs={12}
                lg={12}
                sx={{
                  display: "flex",
                  alignContent: "center",
                  justifyContent: "space-between",
                  mt: 2,
                }}
              >
                <Grid item xs={12} lg={6}>
                  <CustomFormLabel
                    htmlFor="iskonto90180"
                    sx={{ mt: 0, mb: { xs: "-10px", sm: 0 }, mr: 2 }}
                  >
                    <Typography variant="h6" p={1}>
                      İskonto Oranı: 90 - 180 Gün
                    </Typography>
                  </CustomFormLabel>
                </Grid>
                <Grid item xs={12} lg={6}>
                  <CustomTextField
                    id="iskonto90180"
                    type="number"
                    fullWidth
                    value={iskontoOrani90180}
                    onChange={(e: any) =>
                      setIskontoOrani90180(parseFloat(e.target.value))
                    }
                  />
                </Grid>
              </Grid>
              <Grid
                item
                xs={12}
                lg={12}
                sx={{
                  display: "flex",
                  alignContent: "center",
                  justifyContent: "space-between",
                  mt: 2,
                }}
              >
                <Grid item xs={12} lg={6}>
                  <CustomFormLabel
                    htmlFor="iskonto180365"
                    sx={{ mt: 0, mb: { xs: "-10px", sm: 0 }, mr: 2 }}
                  >
                    <Typography variant="h6" p={1}>
                      İskonto Oranı: 180 - 365 Gün
                    </Typography>
                  </CustomFormLabel>
                </Grid>
                <Grid item xs={12} lg={6}>
                  <CustomTextField
                    id="iskonto180365"
                    type="number"
                    fullWidth
                    value={iskontoOrani180365}
                    onChange={(e: any) =>
                      setIskontoOrani180365(parseFloat(e.target.value))
                    }
                  />
                </Grid>
              </Grid>
              <Grid
                item
                xs={12}
                lg={12}
                sx={{
                  display: "flex",
                  alignContent: "center",
                  justifyContent: "space-between",
                  mt: 2,
                }}
              >
                <Grid item xs={12} lg={6}>
                  <CustomFormLabel
                    htmlFor="iskonto365"
                    sx={{ mt: 0, mb: { xs: "-10px", sm: 0 }, mr: 2 }}
                  >
                    <Typography variant="h6" p={1}>
                      İskonto Oranı: 365+ Gün
                    </Typography>
                  </CustomFormLabel>
                </Grid>
                <Grid item xs={12} lg={6}>
                  <CustomTextField
                    id="iskonto365"
                    type="number"
                    fullWidth
                    value={iskontoOrani365}
                    onChange={(e: any) =>
                      setIskontoOrani365(parseFloat(e.target.value))
                    }
                  />
                </Grid>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ justifyContent: "center", mb: "15px" }}>
            <Button
              variant="outlined"
              color="success"
              onClick={() => handleSave()}
              sx={{ width: "20%" }}
            >
              Kaydet
            </Button>
            <Button
              variant="outlined"
              color="error"
              onClick={() => handleDrawerClose()}
              sx={{ width: "20%" }}
            >
              Vazgeç
            </Button>
          </DialogActions>
        </Dialog>
        <TamamlaPopUp
          isTamamlaPopUp={isTamamlaPopUpOpen}
          handleClose={handleCloseTamamlaPopUp}
          handleTamamla={handleTamamla}
        />
      </Grid>
    </PageContainer>
  ) : (
    <Forbidden />
  );
};

export default Page;
