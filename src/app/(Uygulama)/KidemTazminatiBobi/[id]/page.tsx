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
import KidemTazminatiBobiVeriYukleme from "./KidemTazminatiBobiVeriYukleme";
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
import {
  createKidemTazminatiBobiEkBilgi,
  getKidemTazminatiBobiEkBilgi,
} from "@/api/Veri/KidemTazminatiBobi";
import { IconX } from "@tabler/icons-react";
import CustomFormLabel from "@/app/(Uygulama)/components/Forms/ThemeElements/CustomFormLabel";
import CustomTextField from "@/app/(Uygulama)/components/Forms/ThemeElements/CustomTextField";
import CustomSelect from "@/app/(Uygulama)/components/Forms/ThemeElements/CustomSelect";

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

const Page = ({ params }: { params: Promise<{ id: string }> }) => {
  const smDown = useMediaQuery((theme: any) => theme.breakpoints.down("sm"));

  const customizer = useSelector((state: AppState) => state.customizer);
  const theme = useTheme();

  const [showDrawer, setShowDrawer] = React.useState(false);
  const handleDrawerClose = () => {
    setShowDrawer(false);
  };

  const [hesaplansinMi, setHesaplansinMi] = useState("Evet");
  const handleChangeHesaplansinMi = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setHesaplansinMi(event.target.value);
  };

  const [kacGun, setKacGun] = useState(365);
  const handleChangeKacGun = (event: React.ChangeEvent<HTMLInputElement>) => {
    setKacGun(parseInt(event.target.value));
  };

  const [hesaplananKarsilik, setHesaplananKarsilik] = useState<number>(0);
  const [izinKarsiligi, setIzinKarsiligi] = useState<number>(0);
  const [ayrilan2019, setAyrilan2019] = useState<number>(0);
  const [personel2019, setPersonel2019] = useState<number>(0);
  const [ayrilan2020, setAyrilan2020] = useState<number>(0);
  const [personel2020, setPersonel2020] = useState<number>(0);
  const [ayrilan2021, setAyrilan2021] = useState<number>(0);
  const [personel2021, setPersonel2021] = useState<number>(0);
  const [ayrilan2022, setAyrilan2022] = useState<number>(0);
  const [personel2022, setPersonel2022] = useState<number>(0);
  const [ayrilan2023, setAyrilan2023] = useState<number>(0);
  const [personel2023, setPersonel2023] = useState<number>(0);

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

  const handleSave = async () => {
    const createdKidemEkBilgi = {
      denetciId: fetchedData?.denetciId,
      yil: fetchedData?.yil,
      denetlenenId: fetchedData?.denetlenenId,
      hesaplananKarsilik: hesaplananKarsilik,
      hesaplansinMi: hesaplansinMi,
      kacGun: kacGun,
      izinKarsiligi: izinKarsiligi,
      ayrilan2019: ayrilan2019,
      personel2019: personel2019,
      ayrilan2020: ayrilan2020,
      personel2020: personel2020,
      ayrilan2021: ayrilan2021,
      personel2021: personel2021,
      ayrilan2022: ayrilan2022,
      personel2022: personel2022,
      ayrilan2023: ayrilan2023,
      personel2023: personel2023,
    };
    try {
      const result = await createKidemTazminatiBobiEkBilgi(
        "",
        createdKidemEkBilgi
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

  const fetchDataEkBilgi = async () => {
    try {
      const kidemEkBilgiVerileri = await getKidemTazminatiBobiEkBilgi(
        "",
        fetchedData?.denetciId || 0,
        fetchedData?.yil || 0,
        fetchedData?.denetlenenId || 0
      );
      if (kidemEkBilgiVerileri) {
        setHesaplananKarsilik(kidemEkBilgiVerileri.hesaplananKarsilik);
        setHesaplansinMi(kidemEkBilgiVerileri.hesaplansinMi);
        setIzinKarsiligi(kidemEkBilgiVerileri.izinKarsiligi);
        setKacGun(kidemEkBilgiVerileri.kacGun);
        setAyrilan2019(kidemEkBilgiVerileri.ayrilan2019);
        setPersonel2019(kidemEkBilgiVerileri.personel2019);
        setAyrilan2020(kidemEkBilgiVerileri.ayrilan2020);
        setPersonel2020(kidemEkBilgiVerileri.personel2020);
        setAyrilan2021(kidemEkBilgiVerileri.ayrilan2021);
        setPersonel2021(kidemEkBilgiVerileri.personel2021);
        setAyrilan2022(kidemEkBilgiVerileri.ayrilan2022);
        setPersonel2022(kidemEkBilgiVerileri.personel2022);
        setAyrilan2023(kidemEkBilgiVerileri.ayrilan2023);
        setPersonel2023(kidemEkBilgiVerileri.personel2023);
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
      fetchDataEkBilgi();
    }
  }, [fetchedData]);

  return control ? (
    <PageContainer
      title="Kıdem Tazminatı (Bobi)"
      description="this is Kıdem Tazminatı (Bobi)"
    >
      <Breadcrumb
        title="Kıdem Tazminatı (Bobi) Veri Giriş Ekranı"
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
        <Grid size={{ xs: 12, lg: 12 }}>
          {fetchedData != null && (
            <Grid container>
              <Grid
                size={{ xs: 12, lg: 12 }}
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
              <Grid size={{ xs: 12, lg: 12 }}>
                <KidemTazminatiBobiVeriYukleme
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
                size={{ xs: 12, lg: 12 }}
                sx={{
                  display: "flex",
                  alignContent: "center",
                  justifyContent: "space-between",
                }}
              >
                <Grid size={{ xs: 12, lg: 6 }}>
                  <CustomFormLabel
                    htmlFor="hesaplananKarsilik"
                    sx={{ mt: 0, mb: { xs: "-10px", sm: 0 }, mr: 2 }}
                  >
                    <Typography variant="h6" p={1}>
                      Bir Önceki Yıl Hesaplanan Karşılık
                    </Typography>
                  </CustomFormLabel>
                </Grid>
                <Grid size={{ xs: 12, lg: 6 }}>
                  <CustomTextField
                    id="hesaplananKarsilik"
                    type="number"
                    fullWidth
                    value={hesaplananKarsilik}
                    onChange={(e: any) =>
                      setHesaplananKarsilik(parseInt(e.target.value))
                    }
                  />
                </Grid>
              </Grid>
              <Grid
                size={{ xs: 12, lg: 12 }}
                sx={{
                  display: "flex",
                  alignContent: "center",
                  justifyContent: "space-between",
                  mt: 1,
                }}
              >
                <Grid size={{ xs: 12, lg: 6 }}>
                  <CustomFormLabel
                    htmlFor="hesaplansinMi"
                    sx={{ mt: 0, mb: { xs: "-10px", sm: 0 }, mr: 2 }}
                  >
                    <Typography variant="h6" p={1}>
                      Bir Yıldan Az Çalışma Süresi Olanlar İçin Kıdem Tazminatı
                      Hesaplansın mı?
                    </Typography>
                  </CustomFormLabel>
                </Grid>
                <Grid size={{ xs: 12, lg: 6 }}>
                  <CustomSelect
                    labelId="hesaplansinMi"
                    id="hesaplansinMi"
                    size="medium"
                    fullWidth
                    value={hesaplansinMi}
                    onChange={handleChangeHesaplansinMi}
                  >
                    <MenuItem value={"Evet"}>Evet</MenuItem>
                    <MenuItem value={"Hayır"}>Hayır </MenuItem>
                  </CustomSelect>
                </Grid>
              </Grid>
              <Grid
                size={{ xs: 12, lg: 12 }}
                sx={{
                  display: "flex",
                  alignContent: "center",
                  justifyContent: "space-between",
                  mt: 1,
                }}
              >
                <Grid size={{ xs: 12, lg: 6 }}>
                  <CustomFormLabel
                    htmlFor="izinKarsiligi"
                    sx={{ mt: 0, mb: { xs: "-10px", sm: 0 }, mr: 2 }}
                  >
                    <Typography variant="h6" p={1}>
                      Bir Önceki Yıl Hesaplanan Kullanılmamış İzin Karşılığı
                    </Typography>
                  </CustomFormLabel>
                </Grid>
                <Grid size={{ xs: 12, lg: 6 }}>
                  <CustomTextField
                    id="izinKarsiligi"
                    type="number"
                    fullWidth
                    value={izinKarsiligi}
                    onChange={(e: any) =>
                      setIzinKarsiligi(parseInt(e.target.value))
                    }
                  />
                </Grid>
              </Grid>
              <Grid
                size={{ xs: 12, lg: 12 }}
                sx={{
                  display: "flex",
                  alignContent: "center",
                  justifyContent: "space-between",
                  mt: 1,
                }}
              >
                <Grid size={{ xs: 12, lg: 6 }}>
                  <CustomFormLabel
                    htmlFor="kacGun"
                    sx={{ mt: 0, mb: { xs: "-10px", sm: 0 }, mr: 2 }}
                  >
                    <Typography variant="h6" p={1}>
                      Bir Yıl Kaç Gün Olarak Hesaplansın?
                    </Typography>
                  </CustomFormLabel>
                </Grid>
                <Grid size={{ xs: 12, lg: 6 }}>
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
                size={{ xs: 12, lg: 12 }}
                sx={{
                  display: "flex",
                  alignContent: "center",
                  justifyContent: "space-between",
                  mt: 2,
                }}
              >
                <Grid size={{ xs: 12, lg: 6 }}>
                  <CustomFormLabel
                    htmlFor="ayrilan2019"
                    sx={{ mt: 0, mb: { xs: "-10px", sm: 0 }, mr: 2 }}
                  >
                    <Typography variant="h6" p={1}>
                      Tazminat Almadan Ayrılan Kişi Sayısı (
                      {fetchedData?.yil ? fetchedData?.yil - 4 : 0})
                    </Typography>
                  </CustomFormLabel>
                </Grid>
                <Grid size={{ xs: 12, lg: 6 }}>
                  <CustomTextField
                    id="ayrilan2019"
                    type="number"
                    fullWidth
                    value={ayrilan2019}
                    onChange={(e: any) =>
                      setAyrilan2019(parseInt(e.target.value))
                    }
                  />
                </Grid>
              </Grid>
              <Grid
                size={{ xs: 12, lg: 12 }}
                sx={{
                  display: "flex",
                  alignContent: "center",
                  justifyContent: "space-between",
                  mt: 1,
                }}
              >
                <Grid size={{ xs: 12, lg: 6 }}>
                  <CustomFormLabel
                    htmlFor="personel2019"
                    sx={{ mt: 0, mb: { xs: "-10px", sm: 0 }, mr: 2 }}
                  >
                    <Typography variant="h6" p={1}>
                      Ortalama Personel Sayısı (
                      {fetchedData?.yil ? fetchedData?.yil - 4 : 0})
                    </Typography>
                  </CustomFormLabel>
                </Grid>
                <Grid size={{ xs: 12, lg: 6 }}>
                  <CustomTextField
                    id="personel2019"
                    type="number"
                    fullWidth
                    value={personel2019}
                    onChange={(e: any) =>
                      setPersonel2019(parseInt(e.target.value))
                    }
                  />
                </Grid>
              </Grid>
              <Grid
                size={{ xs: 12, lg: 12 }}
                sx={{
                  display: "flex",
                  alignContent: "center",
                  justifyContent: "space-between",
                  mt: 2,
                }}
              >
                <Grid size={{ xs: 12, lg: 6 }}>
                  <CustomFormLabel
                    htmlFor="ayrilan2020"
                    sx={{ mt: 0, mb: { xs: "-10px", sm: 0 }, mr: 2 }}
                  >
                    <Typography variant="h6" p={1}>
                      Tazminat Almadan Ayrılan Kişi Sayısı (
                      {fetchedData?.yil ? fetchedData?.yil - 3 : 0})
                    </Typography>
                  </CustomFormLabel>
                </Grid>
                <Grid size={{ xs: 12, lg: 6 }}>
                  <CustomTextField
                    id="ayrilan2020"
                    type="number"
                    fullWidth
                    value={ayrilan2020}
                    onChange={(e: any) =>
                      setAyrilan2020(parseInt(e.target.value))
                    }
                  />
                </Grid>
              </Grid>
              <Grid
                size={{ xs: 12, lg: 12 }}
                sx={{
                  display: "flex",
                  alignContent: "center",
                  justifyContent: "space-between",
                  mt: 1,
                }}
              >
                <Grid size={{ xs: 12, lg: 6 }}>
                  <CustomFormLabel
                    htmlFor="personel2020"
                    sx={{ mt: 0, mb: { xs: "-10px", sm: 0 }, mr: 2 }}
                  >
                    <Typography variant="h6" p={1}>
                      Ortalama Personel Sayısı (
                      {fetchedData?.yil ? fetchedData?.yil - 3 : 0})
                    </Typography>
                  </CustomFormLabel>
                </Grid>
                <Grid size={{ xs: 12, lg: 6 }}>
                  <CustomTextField
                    id="personel2020"
                    type="number"
                    fullWidth
                    value={personel2020}
                    onChange={(e: any) =>
                      setPersonel2020(parseInt(e.target.value))
                    }
                  />
                </Grid>
              </Grid>
              <Grid
                size={{ xs: 12, lg: 12 }}
                sx={{
                  display: "flex",
                  alignContent: "center",
                  justifyContent: "space-between",
                  mt: 2,
                }}
              >
                <Grid size={{ xs: 12, lg: 6 }}>
                  <CustomFormLabel
                    htmlFor="ayrilan2021"
                    sx={{ mt: 0, mb: { xs: "-10px", sm: 0 }, mr: 2 }}
                  >
                    <Typography variant="h6" p={1}>
                      Tazminat Almadan Ayrılan Kişi Sayısı (
                      {fetchedData?.yil ? fetchedData?.yil - 2 : 0})
                    </Typography>
                  </CustomFormLabel>
                </Grid>
                <Grid size={{ xs: 12, lg: 6 }}>
                  <CustomTextField
                    id="ayrilan2021"
                    type="number"
                    fullWidth
                    value={ayrilan2021}
                    onChange={(e: any) =>
                      setAyrilan2021(parseInt(e.target.value))
                    }
                  />
                </Grid>
              </Grid>
              <Grid
                size={{ xs: 12, lg: 12 }}
                sx={{
                  display: "flex",
                  alignContent: "center",
                  justifyContent: "space-between",
                  mt: 1,
                }}
              >
                <Grid size={{ xs: 12, lg: 6 }}>
                  <CustomFormLabel
                    htmlFor="personel2021"
                    sx={{ mt: 0, mb: { xs: "-10px", sm: 0 }, mr: 2 }}
                  >
                    <Typography variant="h6" p={1}>
                      Ortalama Personel Sayısı (
                      {fetchedData?.yil ? fetchedData?.yil - 2 : 0})
                    </Typography>
                  </CustomFormLabel>
                </Grid>
                <Grid size={{ xs: 12, lg: 6 }}>
                  <CustomTextField
                    id="personel2021"
                    type="number"
                    fullWidth
                    value={personel2021}
                    onChange={(e: any) =>
                      setPersonel2021(parseInt(e.target.value))
                    }
                  />
                </Grid>
              </Grid>
              <Grid
                size={{ xs: 12, lg: 12 }}
                sx={{
                  display: "flex",
                  alignContent: "center",
                  justifyContent: "space-between",
                  mt: 2,
                }}
              >
                <Grid size={{ xs: 12, lg: 6 }}>
                  <CustomFormLabel
                    htmlFor="ayrilan2022"
                    sx={{ mt: 0, mb: { xs: "-10px", sm: 0 }, mr: 2 }}
                  >
                    <Typography variant="h6" p={1}>
                      Tazminat Almadan Ayrılan Kişi Sayısı (
                      {fetchedData?.yil ? fetchedData?.yil - 1 : 0})
                    </Typography>
                  </CustomFormLabel>
                </Grid>
                <Grid size={{ xs: 12, lg: 6 }}>
                  <CustomTextField
                    id="ayrilan2022"
                    type="number"
                    fullWidth
                    value={ayrilan2022}
                    onChange={(e: any) =>
                      setAyrilan2022(parseInt(e.target.value))
                    }
                  />
                </Grid>
              </Grid>
              <Grid
                size={{ xs: 12, lg: 12 }}
                sx={{
                  display: "flex",
                  alignContent: "center",
                  justifyContent: "space-between",
                  mt: 1,
                }}
              >
                <Grid size={{ xs: 12, lg: 6 }}>
                  <CustomFormLabel
                    htmlFor="personel2022"
                    sx={{ mt: 0, mb: { xs: "-10px", sm: 0 }, mr: 2 }}
                  >
                    <Typography variant="h6" p={1}>
                      Ortalama Personel Sayısı (
                      {fetchedData?.yil ? fetchedData?.yil - 1 : 0})
                    </Typography>
                  </CustomFormLabel>
                </Grid>
                <Grid size={{ xs: 12, lg: 6 }}>
                  <CustomTextField
                    id="personel2022"
                    type="number"
                    fullWidth
                    value={personel2022}
                    onChange={(e: any) =>
                      setPersonel2022(parseInt(e.target.value))
                    }
                  />
                </Grid>
              </Grid>
              <Grid
                size={{ xs: 12, lg: 12 }}
                sx={{
                  display: "flex",
                  alignContent: "center",
                  justifyContent: "space-between",
                  mt: 2,
                }}
              >
                <Grid size={{ xs: 12, lg: 6 }}>
                  <CustomFormLabel
                    htmlFor="ayrilan2023"
                    sx={{ mt: 0, mb: { xs: "-10px", sm: 0 }, mr: 2 }}
                  >
                    <Typography variant="h6" p={1}>
                      Tazminat Almadan Ayrılan Kişi Sayısı (
                      {fetchedData?.yil ? fetchedData?.yil : 0})
                    </Typography>
                  </CustomFormLabel>
                </Grid>
                <Grid size={{ xs: 12, lg: 6 }}>
                  <CustomTextField
                    id="ayrilan2023"
                    type="number"
                    fullWidth
                    value={ayrilan2023}
                    onChange={(e: any) =>
                      setAyrilan2023(parseInt(e.target.value))
                    }
                  />
                </Grid>
              </Grid>
              <Grid
                size={{ xs: 12, lg: 12 }}
                sx={{
                  display: "flex",
                  alignContent: "center",
                  justifyContent: "space-between",
                  mt: 1,
                }}
              >
                <Grid size={{ xs: 12, lg: 6 }}>
                  <CustomFormLabel
                    htmlFor="personel2023"
                    sx={{ mt: 0, mb: { xs: "-10px", sm: 0 }, mr: 2 }}
                  >
                    <Typography variant="h6" p={1}>
                      Ortalama Personel Sayısı (
                      {fetchedData?.yil ? fetchedData?.yil : 0})
                    </Typography>
                  </CustomFormLabel>
                </Grid>
                <Grid size={{ xs: 12, lg: 6 }}>
                  <CustomTextField
                    id="personel2023"
                    type="number"
                    fullWidth
                    value={personel2023}
                    onChange={(e: any) =>
                      setPersonel2023(parseInt(e.target.value))
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
