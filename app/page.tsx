'use client';
import { useState } from "react";
import Image from "next/image";
import axios from "axios";

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [responseMessage, setResponseMessage] = useState("");
  const [downloadLink, setDownloadLink] = useState<string | null>(null); // Novo estado para o link de download

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setIsUploading(true);
    setResponseMessage("");
    setDownloadLink(null); // Limpar o link de download

    const formData = new FormData();
    formData.append("blendFile", file); // Nome do campo alterado para "blendFile"

    try {
      // Enviando o arquivo com Axios
      await axios.post("http://192.168.2.102:3000/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data", // Tipo de conteúdo
        },
      });

      // Após o upload, o servidor irá processar o arquivo e gerar o arquivo renderizado
      setResponseMessage("Renderização completa. Arquivo pronto para download.");

      // A rota /download não precisa de parâmetros, o servidor irá retornar o arquivo mais recente
      setDownloadLink("http://192.168.2.102:3000/download");

    } catch (error) {
      setResponseMessage("Erro ao fazer upload.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <Image
          className="dark:invert"
          src="/next.svg"
          alt="Next.js logo"
          width={180}
          height={38}
          priority
        />
        <h1 className="font-[family-name:var(--font-geist-mono)] text-xl mb-4">Envie seu arquivo .blend para renderização</h1>
        
        {/* Formulário de envio */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 items-center">
          <input
            type="file"
            accept=".blend"
            onChange={handleFileChange}
            className="border p-2 rounded"
          />
          <button
            type="submit"
            className="rounded-full border border-solid bg-foreground text-background py-2 px-4"
            disabled={isUploading}
          >
            {isUploading ? "Enviando..." : "Enviar Arquivo"}
          </button>
        </form>

        {/* Mensagem de resposta */}
        {responseMessage && <p className="mt-4">{responseMessage}</p>}

        {/* Link de download do arquivo renderizado */}
        {downloadLink && (
          <a href={downloadLink} className="mt-4 text-blue-500 underline" download>
            Baixar Arquivo Renderizado
          </a>
        )}
      </main>
    </div>
  );
}
