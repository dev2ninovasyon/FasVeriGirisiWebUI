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
import KrediDetayVeriYukleme from "./KrediDetayVeriYukleme";
import { getBaglantiBilgileriByLink } from "@/api/BaglantiBilgileri/BaglantiBilgileri";
import { usePathname } from "next/navigation";
import Forbidden from "@/app/forbidden";
import { useSelector } from "@/store/hooks";
import { AppState } from "@/store/store";
import { getKrediHesaplamaVerileriByDenetciDenetlenenYilId } from "@/api/Veri/KrediHesaplama";

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

const Page = ({ params }: { params: Promise<{ id: string; krediNo: string }> }) => {
  const { id, krediNo: pathKrediNo } = React.use(params);
  const pathId = parseInt(id);
  const smDown = useMediaQuery((theme: any) => theme.breakpoints.down("sm"));

  const pathname = usePathname();
  const segments = pathname.split("/");
  const idIndex = segments.indexOf("KrediDetaylari") + 1;

  const [krediNo, setKrediNo] = useState(0);

  const [control, setControl] = useState(true);

  const [fetchedData, setFetchedData] = useState<Veri | null>(null);

  const [kaydetTiklandimi, setKaydetTiklandimi] = useState(false);
  const [tamamlaTiklandimi, setTamamlaTiklandimi] = useState(false);

  const [sonKaydedilmeTarihi, setSonKaydedilmeTarihi] = useState("");

  const fetchData = async () => {
    try {
      const baglantiBilgisi = await getBaglantiBilgileriByLink(
        `http://betaverigirisi.fasmart.app${pathname.split("/KrediDetay")[0]}`
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

  const fetchDataKrediNo = async () => {
    try {
      const krediHesaplamaVerisi =
        await getKrediHesaplamaVerileriByDenetciDenetlenenYilId(
          "",
          fetchedData?.denetciId || 0,
          fetchedData?.denetlenenId || 0,
          fetchedData?.yil || 0,
          pathId || 0
        );

      setKrediNo(krediHesaplamaVerisi.alinanKrediNumarasi);
    } catch (error) {
      console.error("Bir hata oluştu:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (fetchedData) {
      fetchDataKrediNo();
    }
  }, [fetchedData]);

  return control ? (
    <PageContainer
      title="Kredi Detayları"
      description="this is Kredi Detayları"
    >
      <Breadcrumb
        title={`${krediNo} Numaralı Kredi Detayları Veri Giriş Ekranı`}
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
                </Box>
              </Grid>
              <Grid size={{ xs: 12, lg: 12 }}>
                <KrediDetayVeriYukleme
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
      </Grid>
    </PageContainer>
  ) : (
    <Forbidden />
  );
};

export default Page;
