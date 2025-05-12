"use client";

import PageContainer from "@/app/(Uygulama)/components/Container/PageContainer";
import Breadcrumb from "@/app/(Uygulama)/components/Layout/Breadcrumb/Breadcrumb";
import CustomSelect from "@/app/(Uygulama)/components/Forms/ThemeElements/CustomSelect";
import React, { useState, useCallback, useEffect } from "react";
import {
  Box,
  Button,
  Grid,
  LinearProgress,
  MenuItem,
  Paper,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import DosyaTable from "@/app/(Uygulama)/components/Tables/DosyaTable";
import {
  deleteBaglantiBilgileriById,
  getBaglantiBilgileriByLink,
} from "@/api/BaglantiBilgileri/BaglantiBilgileri";
import { usePathname } from "next/navigation";
import { useDropzone } from "react-dropzone";
import Forbidden from "@/app/forbidden";
import { enqueueSnackbar } from "notistack";
import { useSelector } from "@/store/hooks";
import { AppState } from "@/store/store";
import { TamamlaPopUp } from "@/app/(Uygulama)/components/PopUps/TamamlaPopUp";
import { url } from "@/api/apiBase";
import axios from "axios";

const months = [
  "Ocak",
  "Şubat",
  "Mart",
  "Nisan",
  "Mayıs",
  "Haziran",
  "Temmuz",
  "Ağustos",
  "Eylül",
  "Ekim",
  "Kasım",
  "Aralık",
];

interface DosyaType {
  id: number;
  adi: string;
  olusturulmaTarihi: string;
  durum: string;
}

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

  const borderColor = theme.palette.divider;
  const borderRadius = theme.shape.borderRadius;

  const pathname = usePathname();

  const [control, setControl] = useState(true);

  const [fetchedData, setFetchedData] = useState<Veri | null>(null);

  const [fileType, setFileType] = useState("E-DefterKebir");

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFileType(event.target.value);
  };

  const [rows, setRows] = useState<DosyaType[]>([]);

  const [tamamlaTiklandimi, setTamamlaTiklandimi] = useState(false);
  const [isTamamlaPopUpOpen, setIsTamamlaPopUpOpen] = useState(false);

  const handleCloseTamamlaPopUp = () => {
    setIsTamamlaPopUpOpen(false);
  };

  const [uploading, setUploading] = useState(false);
  const [dosyaYuklendiMi, setDosyaYuklendiMi] = useState(true);
  const [progressInfos, setProgressInfos] = useState<any[]>([]);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      setUploading(true);
      const _progressInfos = acceptedFiles.map((file) => ({
        fileName: file.name,
        percentage: 0,
      }));

      setProgressInfos(_progressInfos);

      try {
        const formData = new FormData();
        acceptedFiles.forEach((file) => {
          formData.append("files", file);
        });

        setDosyaYuklendiMi(false);
        const response = await axios.post(
          `${url}/Veri/DosyaBilgileriYukle?denetciId=${fetchedData?.denetciId}&yil=${fetchedData?.yil}&denetlenenId=${fetchedData?.denetlenenId}&tip=${fileType}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
            onUploadProgress: (event) => {
              const progress = event.total
                ? Math.round((100 * event.loaded) / event.total)
                : 1;

              const updatedProgressInfos = _progressInfos.map((info) => {
                return {
                  ...info,
                  percentage: progress,
                };
              });
              setProgressInfos(updatedProgressInfos);
            },
          }
        );
        if (response.status >= 200 && response.status < 300) {
          setDosyaYuklendiMi(true);
        }
      } catch (error: any) {
        console.error("Dosya yüklenirken hata oluştu:", error);
      } finally {
        setUploading(false);
      }
    },
    [
      fetchedData?.denetciId,
      fetchedData?.yil,
      fetchedData?.denetlenenId,
      fileType,
    ]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      [`application/${
        fileType === "E-DefterKebir" || fileType === "E-DefterYevmiye"
          ? "xml"
          : "pdf"
      }`]: [
        `.${
          fileType === "E-DefterKebir" || fileType === "E-DefterYevmiye"
            ? "xml"
            : "pdf"
        }`,
      ],
    },
  });

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
        `http://fasverigirisitestv1.netlify.app${pathname}`
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
      title="Defter / K. V. Beyannamesi"
      description="this is Defter / K. V. Beyannamesi"
    >
      <Breadcrumb
        title="Defter / K. V. Beyannamesi Veri Yükleme Ekranı"
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
      <Grid container spacing={3}>
        {fetchedData != null && (
          <>
            <Grid
              item
              xs={12}
              lg={12}
              sx={{
                display: "flex",
                flexDirection: smDown ? "column" : "row",
                alignItems: "center",
                justifyContent: "flex-end",
                gap: 1,
              }}
            >
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
                  disabled={tamamlaTiklandimi}
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
            <Grid item xs={12} lg={5}>
              <Box
                sx={{
                  height: "550px",
                  border: `1px solid ${borderColor}`,
                  borderRadius: `${borderRadius}/5`,
                }}
              >
                <Stack
                  direction={"row"}
                  alignItems={"center"}
                  justifyContent={"space-between"}
                >
                  <Typography variant="h5" padding={"16px"}>
                    Dosya Yükle
                  </Typography>
                  <CustomSelect
                    labelId="defter"
                    id="defter"
                    size="small"
                    value={fileType}
                    onChange={handleChange}
                    sx={{
                      height: "32px",
                      minWidth: "120px",
                      marginRight: "16px",
                    }}
                  >
                    <MenuItem value={"E-DefterKebir"}>E-Defter Kebir</MenuItem>
                    <MenuItem value={"E-DefterYevmiye"}>
                      E-Defter Yevmiye
                    </MenuItem>
                    <MenuItem value={"KurumlarBeyannamesi"}>
                      K. V. Beyannamesi
                    </MenuItem>
                  </CustomSelect>
                </Stack>
                {fileType === "E-DefterKebir" && (
                  <Stack direction={"column"} padding={"16px"}>
                    <Typography variant="body2" marginY={"4px"}>
                      UYARI!
                    </Typography>
                    <Typography variant="body2" marginY={"4px"}>
                      1- Örnek Dosya Adı
                      &quot;1716152123-202001-K-000000.xml&quot; Şeklinde Olan,
                      Sadece &quot;K&quot; Harfini İçeren &quot;.xml&quot;
                      Uzantılı E-Defter Kebir Dosyalarını Yükleyiniz.
                    </Typography>
                    <Typography variant="body2" marginY={"4px"}>
                      2- Aynı İsimde Dosya Yüklenmesi Durumunda Son Yüklenen
                      Dosya Geçerli Olacaktır.
                    </Typography>
                  </Stack>
                )}

                <Box
                  {...getRootProps()}
                  sx={{
                    border: `2px dashed ${borderColor}`,
                    borderRadius: `${borderRadius}/5`,
                    padding: "20px",
                    margin: "16px",
                    textAlign: "center",
                    cursor: tamamlaTiklandimi ? "none" : "pointer",
                    pointerEvents: tamamlaTiklandimi ? "none" : "visible",
                    height: "285px",
                    mt: 3,
                  }}
                >
                  <input {...getInputProps()} />
                  {isDragActive ? (
                    <Grid
                      container
                      style={{ height: "100%" }}
                      alignItems="center"
                      justifyContent="center"
                    >
                      <Grid
                        item
                        sm={12}
                        lg={12}
                        style={{ textAlign: "center" }}
                      >
                        <Typography>Dosyaları buraya bırakın...</Typography>
                      </Grid>
                    </Grid>
                  ) : (
                    <Grid
                      container
                      style={{ height: "100%" }}
                      alignItems="center"
                      justifyContent="center"
                    >
                      <Grid
                        item
                        sm={12}
                        lg={12}
                        style={{ textAlign: "center" }}
                      >
                        {uploading ? (
                          <Stack
                            spacing={2}
                            padding={"16px"}
                            flexWrap={"nowrap"}
                            overflow={"auto"} // Taşmayı önler ve gerektiğinde scroll çıkarır
                            maxHeight={"240px"} // Dikey sınır, gerekirse değiştirebilirsiniz
                          >
                            {progressInfos.map((info, index) => (
                              <Box key={index}>
                                <Typography>{info.fileName}</Typography>
                                <LinearProgress
                                  variant="determinate"
                                  value={info.percentage}
                                />
                                <Typography>{info.percentage}%</Typography>
                              </Box>
                            ))}
                          </Stack>
                        ) : (
                          <>
                            <Typography variant="h6" mb={3}>
                              Dosyayı buraya sürükleyin veya tıklayıp seçin.
                            </Typography>
                            <Typography variant="body2">
                              Sadece{" "}
                              {fileType === "E-DefterKebir" ||
                              fileType === "E-DefterYevmiye"
                                ? "XML "
                                : "PDF "}
                              dosyası yükleyebilirsiniz.
                            </Typography>
                          </>
                        )}
                      </Grid>
                    </Grid>
                  )}
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12} lg={7}>
              <Box
                sx={{
                  height: smDown ? "610px" : "550px",
                  border: `1px solid ${borderColor}`,
                  borderRadius: `${borderRadius}/5`,
                }}
              >
                <DosyaTable
                  rows={rows}
                  tamamlaTiklandimi={tamamlaTiklandimi}
                  fetchedData={fetchedData}
                  fileType={fileType}
                  dosyaYuklendiMi={dosyaYuklendiMi}
                  setDosyaYuklendiMi={(deger) => setDosyaYuklendiMi(deger)}
                  setRows={setRows}
                />
              </Box>
            </Grid>
            {fileType === "E-DefterKebir" && (
              <Grid item xs={12} lg={12}>
                <Grid container spacing={2}>
                  {months.map((month, index) => {
                    const monthPart = (index + 1).toString().padStart(2, "0");
                    const count = rows.filter(
                      (item: DosyaType) =>
                        item.adi.split("-")[1]?.slice(-2) === monthPart &&
                        item.durum === "Tamamlandı"
                    ).length;

                    return (
                      <Grid item xs={6} md={3} lg={2} key={index}>
                        <Paper
                          elevation={2}
                          sx={{
                            p: 1,
                            borderRadius: 1,
                            backgroundColor: "warning.light",
                            height: "100%",
                          }}
                        >
                          <Typography
                            variant="body1"
                            sx={{ color: "warning.dark" }}
                          >
                            {month} Ayı Dosya Sayısı: {count}
                          </Typography>
                        </Paper>
                      </Grid>
                    );
                  })}
                </Grid>
              </Grid>
            )}
          </>
        )}
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
