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

const Page = ({ params }: { params: Promise<{ id: string }> }) => {
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
        status: "Yükleniyor...",
      }));

      setProgressInfos(_progressInfos);

      try {
        setDosyaYuklendiMi(false);

        const uploadPromises = acceptedFiles.map(async (file, index) => {
          const formData = new FormData();
          formData.append("files", file);

          try {
            await axios.post(
              `${url}/Veri/DosyaBilgileriYukle?denetciId=${fetchedData?.denetciId}&yil=${fetchedData?.yil}&denetlenenId=${fetchedData?.denetlenenId}&tip=${fileType}`,
              formData,
              {
                headers: { "Content-Type": "multipart/form-data" },
                onUploadProgress: (event) => {
                  const progress = event.total ? Math.round((100 * event.loaded) / event.total) : 1;
                  setProgressInfos((prev) => {
                    const next = [...prev];
                    next[index] = { ...next[index], percentage: Math.round(progress * 0.2), status: "Yükleniyor..." }; // Upload is 20%
                    return next;
                  });
                },
              }
            );

            setProgressInfos((prev) => {
              const next = [...prev];
              next[index] = { ...next[index], status: "Yüklendi", percentage: 20 };
              return next;
            });
          } catch (error) {
            setProgressInfos((prev) => {
              const next = [...prev];
              next[index] = { ...next[index], status: "Hata!", percentage: 0 };
              return next;
            });
          }
        });

        await Promise.all(uploadPromises);

        // Polling for processing status
        const interval = setInterval(async () => {
          try {
            const res = await axios.get(`${url}/Veri/DosyaDurumlari?denetciId=${fetchedData?.denetciId}&yil=${fetchedData?.yil}&denetlenenId=${fetchedData?.denetlenenId}&tip=${fileType}`);
            const data = res.data;

            setProgressInfos((prev) => {
              return prev.map((info) => {
                const serverFile = data.find((d: any) => d.adi === info.fileName);
                if (serverFile) {
                  const serverProgress = serverFile.progress || 0;
                  const totalProgress = 20 + Math.round(serverProgress * 0.8);
                  return {
                    ...info,
                    percentage: Math.min(totalProgress, 100),
                    status: serverFile.durum,
                  };
                }
                return info;
              });
            });

            // Check if all files are processed based on the fetched data
            const allDone = acceptedFiles.every((file) => {
              const serverFile = data.find((d: any) => d.adi === file.name);
              return serverFile && (serverFile.durum === "Tamamlandı" || serverFile.durum === "Hata Oluştu");
            });

            if (allDone) {
              clearInterval(interval);
              setUploading(false);
              setDosyaYuklendiMi(true);
              enqueueSnackbar("Tüm dosyalar işlendi.", { variant: "success" });
              setControl(true);
            }
          } catch (error) {
            console.error("Polling error:", error);
          }
        }, 2000);

      } catch (error: any) {
        console.log("Dosya yüklenirken hata oluştu:", error);
        enqueueSnackbar("İşlem sırasında bir hata oluştu.", { variant: "error" });
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
      [`application/${fileType === "E-DefterKebir" || fileType === "E-DefterYevmiye"
        ? "xml"
        : "pdf"
        }`]: [
          `.${fileType === "E-DefterKebir" || fileType === "E-DefterYevmiye"
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
              size={{ xs: 12, lg: 12 }}
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
            <Grid size={{ xs: 12, lg: 5 }}>
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
                        size={{ sm: 12, lg: 12 }}
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
                        size={{ sm: 12, lg: 12 }}
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
                              <Box key={index} sx={{ mb: 2, textAlign: "left" }}>
                                <Stack direction="row" justifyContent="space-between" alignItems="center" mb={0.5}>
                                  <Typography variant="body2" sx={{ fontWeight: 600, color: "text.primary", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: "70%" }}>
                                    {info.fileName}
                                  </Typography>
                                  <Typography variant="caption" sx={{
                                    fontWeight: 700,
                                    color: info.status === "Tamamlandı" ? "success.main" :
                                      info.status === "Hata!" || info.status === "Hata Oluştu" ? "error.main" :
                                        "primary.main"
                                  }}>
                                    {info.status}
                                  </Typography>
                                </Stack>
                                <LinearProgress
                                  variant="determinate"
                                  value={info.percentage}
                                  sx={{
                                    height: 8,
                                    borderRadius: 5,
                                    backgroundColor: theme.palette.grey[200],
                                    "& .MuiLinearProgress-bar": {
                                      borderRadius: 5,
                                      backgroundColor: info.status === "Tamamlandı" ? "success.main" :
                                        info.status === "Hata!" || info.status === "Hata Oluştu" ? "error.main" :
                                          "primary.main",
                                    }
                                  }}
                                />
                                <Typography variant="caption" sx={{ display: "block", textAlign: "right", mt: 0.5, color: "text.secondary" }}>
                                  %{info.percentage}
                                </Typography>
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
            <Grid size={{ xs: 12, lg: 7 }}>
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
              <Grid size={{ xs: 12, lg: 12 }}>
                <Grid container spacing={2}>
                  <Grid
                    size={{ xs: 12, md: 12, lg: 12 }}>
                    <Typography variant="h6" textAlign="left" mb={1}>
                      Yüklenen Defter Sayıları:
                    </Typography>
                  </Grid>
                  {months.map((month, index) => {
                    const monthPart = (index + 1).toString().padStart(2, "0");
                    const count = rows.filter(
                      (item: DosyaType) =>
                        item.adi.split("-")[1]?.slice(-2) === monthPart &&
                        item.durum === "Tamamlandı"
                    ).length;

                    return (
                      <Grid
                        key={index}
                        size={{ xs: 6, md: 3, lg: 2 }}>
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
                            textAlign={"center"}
                          >
                            {month}: {count}
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
