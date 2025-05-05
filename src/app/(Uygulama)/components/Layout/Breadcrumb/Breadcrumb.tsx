"use client";
import React from "react";
import { Grid, Typography, Theme, useMediaQuery } from "@mui/material";
import Logo from "@/app/(Uygulama)/components/Logo/Logo";
import Image from "next/image";
import { useSelector } from "@/store/hooks";
import { AppState } from "@/store/store";
import Link from "next/link";

interface BreadCrumbType {
  title: string;
  subtitle?: string;
  note?: string;
}

const Breadcrumb = ({ title, subtitle, note }: BreadCrumbType) => {
  const smDown = useMediaQuery((theme: any) => theme.breakpoints.down("sm"));

  const customizer = useSelector((state: AppState) => state.customizer);

  return (
    <Grid
      container
      sx={{
        backgroundColor: "primary.light",
        borderRadius: (theme: Theme) => theme.shape.borderRadius / 4,
        p: "30px 25px 20px",
        marginBottom: "20px",
        position: "relative",
        overflow: "hidden",
        mt: 3,
      }}
    >
      {smDown && (
        <Grid
          item
          xs={12}
          display="flex"
          alignItems="center"
          justifyContent="center"
          mb={3}
        >
          <Link href="/">
            <Image
              src="/images/logos/fas-logo-yazili-siyah.png"
              alt="logo"
              height={customizer.TopbarHeight}
              width={188}
              style={{ padding: "4px 4px", width: "auto", height: "auto" }}
              priority
            />
          </Link>
        </Grid>
      )}
      <Grid
        item
        xs={12}
        sm={6}
        lg={8}
        display="flex"
        alignItems="center"
        justifyContent={smDown ? "center" : "flex-start"}
      >
        <Grid container>
          <Grid item xs={12} sm={12} lg={12}>
            <Typography textAlign={smDown ? "center" : "left"} variant="h4">
              {title}
            </Typography>
          </Grid>
          {subtitle && (
            <Grid item xs={12} sm={12} lg={12} mt={1}>
              <Typography
                textAlign={smDown ? "center" : "left"}
                variant="body1"
              >
                {subtitle}
              </Typography>
            </Grid>
          )}
          {note && (
            <Grid item xs={12} sm={12} lg={12} mt={1}>
              <Typography
                textAlign={smDown ? "center" : "left"}
                variant="body2"
              >
                {note}
              </Typography>
            </Grid>
          )}
        </Grid>
      </Grid>
      {!smDown && (
        <Grid
          item
          xs={6}
          sm={6}
          lg={4}
          display="flex"
          alignItems="center"
          justifyContent="flex-end"
        >
          <Link href="/">
            <Image
              src="/images/logos/fas-logo-yazili-siyah.png"
              alt="logo"
              height={customizer.TopbarHeight}
              width={188}
              style={{ padding: "4px 4px", width: "auto", height: "auto" }}
              priority
            />
          </Link>
        </Grid>
      )}
    </Grid>
  );
};

export default Breadcrumb;
