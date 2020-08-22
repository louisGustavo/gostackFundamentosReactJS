import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

import filesize from 'filesize';

import Header from '../../components/Header';
import FileList from '../../components/FileList';
import Upload from '../../components/Upload';

import { Container, Title, ImportFileContainer, Footer } from './styles';

import alert from '../../assets/alert.svg';
import api from '../../services/api';

interface FileProps {
  file: File;
  name: string;
  readableSize: string;
}

const Import: React.FC = () => {
  const [uploadedFiles, setUploadedFiles] = useState<FileProps[]>([]);
  const history = useHistory();

  async function handleUpload(): Promise<void> {
    //O método formData vai converter os dados para form
    const data = new FormData();

    //evita fazer upload caso não exista arquivos para importar
    if(!uploadedFiles) return;

    //Recupera somente o primeiro arquivo do upload
    const file = uploadedFiles[0];

    //Faz a inclusão dos dados desse arquivo no formData
    //Parâmetros:
    //Campo 'file', arquivo 'file.file' e nome do arquivo 'file.name'
    data.append('file', file.file, file.name);

    try {
      //faz o upload do arquivo via API
      await api.post('/transactions/import', data);

      //retorna para a rota raiz
      history.push('/');
    } catch (err) {
      console.log(err.response.error);
    }
  }

  function submitFile(files: File[]): void {

    //Recuperar os dados dos arquivos que serão importados
    //e nomeá-los conforme a interface "FileProps" deve receber
    const uploadFiles = files.map(file => ({
      file,
      name: file.name,
      readableSize: filesize(file.size), //função torna o valor total legível
    }));

    console.log(uploadFiles);

    //Ssetar para a uploadedFiles
    setUploadedFiles(uploadFiles);
  }

  return (
    <>
      <Header size="small" />
      <Container>
        <Title>Importar uma transação</Title>
        <ImportFileContainer>
          <Upload onUpload={submitFile} />
          {!!uploadedFiles.length && <FileList files={uploadedFiles} />}

          <Footer>
            <p>
              <img src={alert} alt="Alert" />
              Permitido apenas arquivos CSV
            </p>
            <button onClick={handleUpload} type="button">
              Enviar
            </button>
          </Footer>
        </ImportFileContainer>
      </Container>
    </>
  );
};

export default Import;
