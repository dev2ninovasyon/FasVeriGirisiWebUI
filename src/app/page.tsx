"use client";
import { Grid, Box, Card, Typography } from "@mui/material";

// components
import PageContainer from "./(Uygulama)/components/Container/PageContainer";
import Logo from "./(Uygulama)/components/Logo/Logo";

export default function Page() {
  return (
    <PageContainer title="Giriş" description="this is Giriş">
      <Box
        sx={{
          position: "relative",
          "&:before": {
            content: '""',
            background: "radial-gradient(#d2f1df, #d3d7fa, #bad8f4)",
            backgroundSize: "400% 400%",
            animation: "gradient 15s ease infinite",
            position: "absolute",
            height: "100%",
            width: "100%",
            opacity: "0.3",
          },
        }}
      >
        <Grid
          container
          spacing={0}
          justifyContent="center"
          sx={{ height: "100vh" }}
        >
          <Grid
            item
            xs={12}
            sm={12}
            lg={5}
            xl={4}
            display="flex"
            justifyContent="center"
            alignItems="center"
          >
            <Card
              elevation={9}
              sx={{ p: 4, zIndex: 1, width: "100%", maxWidth: "720px" }}
            >
              <Box display="flex" alignItems="center" justifyContent="center">
                <Logo />
              </Box>
              <Typography
                textAlign="center"
                fontWeight="700"
                variant="h5"
                my={3}
              >
                Veri Giriş Ve Yönetim Ekranı
              </Typography>
              <Typography textAlign="center" variant="h6" my={1}>
                Bu uygulama yalnızca geçerli bağlantıya sahip kullanıcılar
                tarafından erişilebilir
              </Typography>
              <Typography textAlign="center" variant="body1" mt={6}>
                {new Date().getFullYear()} © 2N İnovasyon Araştırma Geliştirme
                Yazılım Tic. Ltd. Şti.
              </Typography>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </PageContainer>
  );
}

Page.layout = "Blank";
