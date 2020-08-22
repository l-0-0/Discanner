import React from "react";
import QRCode from "qrcode.react";

export default function QRCodeGenerator({ text, size }) {
    return <QRCode value={text} />;
}
