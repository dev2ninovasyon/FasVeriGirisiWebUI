"use client";

import React, { useEffect, useState } from "react";
import {
    Container,
    Card,
    CardContent,
    Typography,
    Button,
    Box,
    Stack,
    Alert,
    CircularProgress,
    Chip,
    useTheme,
    Paper,
    Divider,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import DownloadIcon from "@mui/icons-material/Download";
import { useParams } from "next/navigation";
import PageContainer from "@/app/(Uygulama)/components/Container/PageContainer";
import Breadcrumb from "../../components/Layout/Breadcrumb/Breadcrumb";
import {
    validateMutabakatToken,
    uploadViaMutabakatToken,
    ValidateMutabakatTokenResponse,
} from "@/api/MutabakatMektup"; // Bu API client'ı betaverigirisi uygulamasına kopyalayın

export default function MutabakatUploadPage({ params }: { params: Promise<{ token: string }> }) {
    const { token } = React.use(params);
    const theme = useTheme();
    const [isValidating, setIsValidating] = useState(true);
    const [validationData, setValidationData] = useState<ValidateMutabakatTokenResponse | null>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadSuccess, setUploadSuccess] = useState(false);
    const [error, setError] = useState("");
    const [isDragging, setIsDragging] = useState(false);

    useEffect(() => {
        validateToken();
    }, [token]);

    const validateToken = async () => {
        try {
            setIsValidating(true);
            setError("");
            const response = await validateMutabakatToken(token);

            if (response.isValid) {
                setValidationData(response);
            } else {
                setError(response.message);
            }
        } catch (err: any) {
            setError(err.message || "Token doğrulanamadı");
        } finally {
            setIsValidating(false);
        }
    };

    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            setError("");
        }
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files[0];
        if (file) {
            setSelectedFile(file);
            setError("");
        }
    };

    const handleUpload = async () => {
        if (!selectedFile) {
            setError("Lütfen bir dosya seçin");
            return;
        }

        try {
            setIsUploading(true);
            setError("");
            await uploadViaMutabakatToken(token, selectedFile);
            setUploadSuccess(true);
        } catch (err: any) {
            setError(err.message || "Dosya yüklenemedi");
        } finally {
            setIsUploading(false);
        }
    };

    if (isValidating) {
        return (
            <Container maxWidth="md" sx={{ mt: 8 }}>
                <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
                    <Stack spacing={2} alignItems="center">
                        <CircularProgress size={60} />
                        <Typography variant="h6">Token doğrulanıyor...</Typography>
                    </Stack>
                </Box>
            </Container>
        );
    }

    if (error && !validationData) {
        return (
            <Container maxWidth="md" sx={{ mt: 8 }}>
                <Alert severity="error" icon={<ErrorIcon />}>
                    <Typography variant="h6" gutterBottom>
                        Token Geçersiz
                    </Typography>
                    <Typography>{error}</Typography>
                </Alert>
            </Container>
        );
    }

    if (uploadSuccess) {
        return (
            <Container maxWidth="md" sx={{ mt: 8 }}>
                <Card>
                    <CardContent>
                        <Stack spacing={3} alignItems="center" py={4}>
                            <CheckCircleIcon color="success" sx={{ fontSize: 80 }} />
                            <Typography variant="h4" fontWeight="bold" color="success.main">
                                Mektup Başarıyla Yüklendi!
                            </Typography>
                            <Typography variant="body1" color="text.secondary" textAlign="center">
                                Yüklediğiniz mektup kaydedildi. İlgili departman tarafından incelenecektir.
                            </Typography>
                            <Box mt={2}>
                                <Typography variant="caption" color="text.secondary">
                                    Dosya adı: {selectedFile?.name}
                                </Typography>
                            </Box>
                        </Stack>
                    </CardContent>
                </Card>
            </Container>
        );
    }

    return (
        <PageContainer
            title="Mutabakat Mektup Yükleme"
            description="Mutabakat mektup yükleme sayfası"
        >
            <Breadcrumb
                title="Mutabakat Mektup Yükleme"
                subtitle={
                    validationData
                        ? `${validationData.aliciAdi || 'Alıcı'} ⚬ ${validationData.yil}`
                        : undefined
                }
                note={
                    validationData?.sonKullanmaTarihi
                        ? `Bağlantı Son Geçerlilik Tarihi: ${new Date(validationData.sonKullanmaTarihi).toLocaleString("tr-TR")}`
                        : undefined
                }
            />
            <Container maxWidth="md" sx={{ mt: 4, mb: 8 }}>
                <Card elevation={3}>
                    <CardContent sx={{ p: 4 }}>
                        {/* Header */}
                        <Box mb={4}>
                            <Typography variant="h4" fontWeight="bold" gutterBottom>
                                Mutabakat Mektup Yükleme
                            </Typography>
                            <Typography variant="body1" color="text.secondary">
                                Aşağıdaki bilgiler için mutabakat doğrulama mektubunuzu yükleyebilirsiniz.
                            </Typography>
                        </Box>

                        <Divider sx={{ mb: 3 }} />

                        {/* Record Information */}
                        <Paper variant="outlined" sx={{ p: 3, mb: 4, bgcolor: "action.hover" }}>
                            <Typography variant="h6" gutterBottom fontWeight="bold">
                                Kayıt Bilgileri
                            </Typography>
                            <Stack spacing={1.5} mt={2}>
                                <Box display="flex" justifyContent="space-between">
                                    <Typography variant="body2" color="text.secondary">
                                        Hesap Adi:
                                    </Typography>
                                    <Typography variant="body2" fontWeight="bold">
                                        {validationData?.aliciAdi}
                                    </Typography>
                                </Box>
                                <Box display="flex" justifyContent="space-between">
                                    <Typography variant="body2" color="text.secondary">
                                        Detay Kodu:
                                    </Typography>
                                    <Typography variant="body2" fontWeight="bold">
                                        {validationData?.detayKodu}
                                    </Typography>
                                </Box>
                                <Box display="flex" justifyContent="space-between">
                                    <Typography variant="body2" color="text.secondary">
                                        Yıl:
                                    </Typography>
                                    <Typography variant="body2" fontWeight="bold">
                                        {validationData?.yil}
                                    </Typography>
                                </Box>
                                <Box display="flex" justifyContent="space-between">
                                    <Typography variant="body2" color="text.secondary">
                                        Son Kullanma:
                                    </Typography>
                                    <Typography variant="body2" fontWeight="bold" color="warning.main">
                                        {validationData?.sonKullanmaTarihi &&
                                            new Date(validationData.sonKullanmaTarihi).toLocaleString("tr-TR")}
                                    </Typography>
                                </Box>
                            </Stack>

                            {validationData?.mektupYuklendi && (
                                <Box mt={2}>
                                    <Chip
                                        label="Bu kayıt için mektup daha önce yüklenmiştir"
                                        color="success"
                                        icon={<CheckCircleIcon />}
                                        sx={{ width: "100%" }}
                                    />
                                </Box>
                            )}
                        </Paper>

                        {/* Upload Area */}
                        <Box
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                            sx={{
                                border: `2px dashed ${isDragging ? theme.palette.primary.main : theme.palette.divider}`,
                                borderRadius: 2,
                                p: 4,
                                textAlign: "center",
                                bgcolor: isDragging ? "action.hover" : "background.default",
                                cursor: "pointer",
                                transition: "all 0.3s",
                                "&:hover": {
                                    borderColor: theme.palette.primary.main,
                                    bgcolor: "action.hover",
                                },
                            }}
                            onClick={() => document.getElementById("file-input")?.click()}
                        >
                            <input
                                id="file-input"
                                type="file"
                                hidden
                                accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
                                onChange={handleFileSelect}
                            />
                            <Stack spacing={2} alignItems="center">
                                <CloudUploadIcon sx={{ fontSize: 60, color: "primary.main" }} />
                                <Typography variant="h6">
                                    {selectedFile
                                        ? `Seçili dosya: ${selectedFile.name}`
                                        : "Dosyayı buraya sürükleyin veya tıklayıp seçin"}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Desteklenen formatlar: PDF, Word, PNG, JPEG
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                    Maksimum dosya boyutu: 10 MB
                                </Typography>
                            </Stack>
                        </Box>

                        {error && (
                            <Alert severity="error" sx={{ mt: 3 }}>
                                {error}
                            </Alert>
                        )}

                        {/* Action Buttons */}
                        <Stack direction="row" spacing={2} mt={4} justifyContent="center">
                            <Button
                                variant="contained"
                                size="large"
                                startIcon={isUploading ? <CircularProgress size={20} /> : <CloudUploadIcon />}
                                onClick={handleUpload}
                                disabled={!selectedFile || isUploading}
                                sx={{ minWidth: 200 }}
                            >
                                {isUploading ? "Yükleniyor..." : "Mektubu Yükle"}
                            </Button>
                            {selectedFile && !isUploading && (
                                <Button variant="outlined" size="large" onClick={() => setSelectedFile(null)}>
                                    Dosyayı Kaldır
                                </Button>
                            )}
                        </Stack>

                        {/* Info */}
                        <Box mt={4}>
                            <Alert severity="info">
                                <Typography variant="body2">
                                    Yüklediğiniz mektup ilgili departman tarafından incelenecektir. Yükleme işleminden sonra bu
                                    sayfayı kapatabilirsiniz.
                                </Typography>
                            </Alert>
                        </Box>
                    </CardContent>
                </Card>

                {/* Footer */}
                <Box mt={4} textAlign="center">
                    <Typography variant="caption" color="text.secondary">
                        © 2024 FASmart - Finansal Audit Software
                    </Typography>
                </Box>
            </Container>
        </PageContainer>
    );
}
