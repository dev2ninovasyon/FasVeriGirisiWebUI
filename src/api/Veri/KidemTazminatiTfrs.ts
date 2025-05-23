import { url } from "@/api/apiBase";

export const getKidemTazminatiTfrsVerileriByDenetciDenetlenenYil = async (
  token: string,
  denetciId: number,
  denetlenenId: number,
  yil: number
) => {
  try {
    const response = await fetch(
      `${url}/Veri/KidemTazminatiTfrs?denetciId=${denetciId}&yil=${yil}&denetlenenId=${denetlenenId}`,
      {
        method: "GET",
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (response.ok) {
      return response.json();
    } else {
      console.error("Kıdem Tazminatı Tfrs verileri getirilemedi");
    }
  } catch (error) {
    console.error("Bir hata oluştu:", error);
  }
};

export const createKidemTazminatiTfrsVerisi = async (
  token: string,
  jsonData: any
) => {
  try {
    const response = await fetch(`${url}/Veri/KidemTazminatiTfrs`, {
      method: "POST",
      headers: {
        accept: "*/*",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(jsonData),
    });

    if (response.ok) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error("Bir hata oluştu:", error);
  }
};

export const deleteKidemTazminatiTfrsVerisi = async (
  token: string,
  denetciId: number,
  denetlenenId: number,
  yil: number
) => {
  try {
    const response = await fetch(
      `${url}/Veri/KidemTazminatiTfrs?denetciId=${denetciId}&yil=${yil}&denetlenenId=${denetlenenId}`,
      {
        method: "DELETE",
        headers: {
          accept: "*/*",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.ok) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error("Bir hata oluştu:", error);
  }
};

export const getKidemTazminatiTfrsEkBilgi = async (
  token: string,
  denetciId: number,
  yil: number,
  denetlenenId: number
) => {
  try {
    const response = await fetch(
      `${url}/Hesaplamalar/KidemTazminatiTfrsEkBilgi?denetciId=${denetciId}&denetlenenId=${denetlenenId}&yil=${yil}`,
      {
        method: "GET",
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.status == 200) {
      return response.json();
    } else {
      console.error("Kıdem Tazminatı Tfrs Ek verileri getirilemedi");
    }
  } catch (error) {
    console.error("Bir hata oluştu:", error);
  }
};

export const createKidemTazminatiTfrsEkBilgi = async (
  token: string,
  createdKidemTazminatiTfrsEkBilgiVerisi: any
) => {
  try {
    const response = await fetch(
      `${url}/Hesaplamalar/KidemTazminatiTfrsEkBilgi`,
      {
        method: "POST",
        headers: {
          accept: "*/*",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(createdKidemTazminatiTfrsEkBilgiVerisi),
      }
    );

    if (response.ok) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error("Bir hata oluştu:", error);
  }
};

export const getEnflasyonOrani = async (token: string, yil: number) => {
  try {
    const response = await fetch(
      `${url}/Hesaplamalar/EnflasyonOrani?yil=${yil}`,
      {
        method: "GET",
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (response.ok) {
      return response.json();
    } else {
      console.error("Enflasyon Oranı getirilemedi");
    }
  } catch (error) {
    console.error("Bir hata oluştu:", error);
  }
};

export const getFaizOrani = async (token: string, yil: number) => {
  try {
    const response = await fetch(`${url}/Hesaplamalar/FaizOrani?yil=${yil}`, {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    if (response.ok) {
      return response.json();
    } else {
      console.error("Faiz Oranı getirilemedi");
    }
  } catch (error) {
    console.error("Bir hata oluştu:", error);
  }
};
