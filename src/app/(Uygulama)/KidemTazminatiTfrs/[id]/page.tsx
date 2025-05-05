"use client";

import PageContainer from "@/app/(Uygulama)/components/Container/PageContainer";
import Breadcrumb from "@/app/(Uygulama)/components/Layout/Breadcrumb/Breadcrumb";
import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Grid,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import KidemTazminatiTfrsVeriYukleme from "./KidemTazminatiTfrsVeriYukleme";
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

  const fetchData = async () => {
    try {
      const baglantiBilgisi = await getBaglantiBilgileriByLink(
        `http://localhost:3001${pathname}`
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

  useEffect(() => {
    fetchData();
  }, []);

  return control ? (
    <PageContainer
      title="Kıdem Tazminatı (Tfrs)"
      description="this is Kıdem Tazminatı (Tfrs)"
    >
      <Breadcrumb
        title="Kıdem Tazminatı (Tfrs)"
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
                    variant="body2"
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
                <KidemTazminatiTfrsVeriYukleme
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
