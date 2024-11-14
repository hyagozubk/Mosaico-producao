import React, { useState, useEffect } from 'react';
import './styles/Editor.css';
import './styles/Login.css';
import Header from './components/Header';

const IconEditor = () => {
  const [formData, setFormData] = useState({
    id: '',
    src: null,
    descricao: '',
    id_implementacao: '', // novo campo para id_implementacao
  });
  const [iconIds, setIconIds] = useState([]);
  const [selectedId, setSelectedId] = useState('');
  const [action, setAction] = useState('add');
  const [imagePreview, setImagePreview] = useState(null);
  const [creationDate, setCreationDate] = useState(null);
  const [modificationDate, setModificationDate] = useState(null);

  // Função para buscar os IDs de ícones
  const fetchIconIds = async () => {
    try {
      const response = await fetch('https://gentle-nearly-marmoset.ngrok-free.app/api/icons/ids', {
        headers: { 'ngrok-skip-browser-warning': 'true' }
      });
      if (response.ok) {
        const data = await response.json();
        setIconIds(data);
      } else {
        console.error('Erro ao buscar IDs de ícones');
      }
    } catch (error) {
      console.error('Erro ao conectar com o backend:', error);
    }
  };

  // Função para buscar um ícone por ID
  const fetchIconById = async (id) => {
    try {
      const response = await fetch(`https://gentle-nearly-marmoset.ngrok-free.app/api/icons/${id}`, {
        headers: { 'ngrok-skip-browser-warning': 'true' }
      });
      if (response.ok) {
        const { src, descricao, id_implementacao, dt_criacao, dt_modificacao } = await response.json();

        if (src && Array.isArray(src.data) && src.type) {
          const blob = new Blob([Uint8Array.from(src.data)], { type: src.type });
          const imageUrl = URL.createObjectURL(blob);
          setImagePreview(imageUrl);
        }

        setCreationDate(dt_criacao);
        setModificationDate(dt_modificacao);
        setFormData({ descricao, id_implementacao });
      } else {
        console.error('Erro ao buscar o ícone:', response.statusText);
      }
    } catch (error) {
      console.error('Erro ao conectar com o backend:', error);
    }
  };

  useEffect(() => {
    fetchIconIds();
  }, []);

  const handleChange = (e) => {
    const { name, type, value } = e.target;
    if (type === 'file') {
      setFormData({ ...formData, src: e.target.files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleActionChange = (e) => {
    setAction(e.target.value);
    setSelectedId('');
    setImagePreview(null);
    setFormData({ id: '', src: null, descricao: '', id_implementacao: '' });
    setCreationDate(null);
    setModificationDate(null);
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(`https://gentle-nearly-marmoset.ngrok-free.app/api/icons/delete/${selectedId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json','ngrok-skip-browser-warning': 'true' },
      });

      if (response.ok) {
        alert('Ícone deletado com sucesso!');
        fetchIconIds();
        setImagePreview(null);
        setFormData({ id: '', src: null, descricao: '', id_implementacao: '' });
        setSelectedId('');
      } else {
        const error = await response.text();
        console.error('Erro ao deletar o ícone:', error);
      }
    } catch (error) {
      console.error('Erro ao conectar com o backend:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formDataToSend = new FormData();

    if (action === 'add') {
      formDataToSend.append('icon_id', formData.id);
      formDataToSend.append('src', formData.src);
      formDataToSend.append('descricao', formData.descricao);
      formDataToSend.append('id_implementacao', formData.id_implementacao);
      formDataToSend.append('dt_criacao', new Date().toISOString());
    } else if (action === 'modify') {
      formDataToSend.append('icon_id', selectedId);
      formDataToSend.append('src', formData.src);
      formDataToSend.append('descricao', formData.descricao);
      formDataToSend.append('id_implementacao', formData.id_implementacao);
      formDataToSend.append('dt_modificacao', new Date().toISOString());
    }

    try {
      const url = `https://gentle-nearly-marmoset.ngrok-free.app/api/icons/${action === 'add' ? 'add' : 'modify'}`;
      const method = action === 'add' ? 'POST' : 'PUT'

      const response = await fetch(url, {
        method,
        body: formDataToSend,
        headers: { 'ngrok-skip-browser-warning': 'true' },
      });

      if (response.ok) {
        alert(`Ícone ${action === 'add' ? 'adicionado' : 'modificado'} com sucesso!`);
        fetchIconIds();
        setImagePreview(null);
        setFormData({ id: '', src: null, descricao: '', id_implementacao: '' });
        setSelectedId('');
      } else {
        const error = await response.text();
        console.error('Erro ao enviar os dados:', error);
      }
    } catch (error) {
      console.error('Erro ao conectar com o backend:', error);
    }
  };

  return (
    <div className="icon-editor-container">
      <Header />
      <div className='icon-editor-label-title'>
        <h2 className="icon-editor-title">Editor de ícones</h2>
      </div>
      <form className="icon-editor-form" onSubmit={handleSubmit}>
        {action === 'add' && (
          <>
              <select className='select' onChange={handleActionChange} value={action}>
                <option value="add">Adicionar Ícone</option>
                <option value="modify">Modificar Ícone</option>
              </select>
            <div className="form-group">
              <label className="icon-editor-label">ID do Ícone:</label>
              <input
                type="text"
                name="id"
                value={formData.id}
                onChange={handleChange}
                placeholder="Digite o ID do ícone"
                className="icon-editor-input"
                required
              />
            </div>

            <div className="form-group">
              <label className="icon-editor-label">Descrição:</label>
              <input
                type="text"
                name="descricao"
                value={formData.descricao}
                onChange={handleChange}
                placeholder="Digite a descrição do ícone"
                className="icon-editor-input"
                required
              />
            </div>

            <div className="form-group">
              <label className="icon-editor-label">Carregar Imagem:</label>
              <input
                type="file"
                name="src"
                onChange={handleChange}
                accept="image/*"
                className="icon-editor-input-file"
                required
              />
            </div>
            <button type="submit" className="icon-editor-button-salvar">Salvar</button>
          </>
        )}

        {action === 'modify' && (
          <>
              <select className='select' onChange={handleActionChange} value={action}>
                <option value="add">Adicionar Ícone</option>
                <option value="modify">Modificar Ícone</option>
              </select>
            <div className="form-group">
            <label className="icon-editor-label">ID da Implementação:</label>
            <input
              type="text"
              name="id_implementacao"
              value={formData.id_implementacao}
              onChange={handleChange}
              placeholder="Digite o ID de implementação"
              className="icon-editor-input"
              required
            />
            </div>
            <div className="form-group">
              <label className="icon-editor-label">ID do Ícone:</label>
              <input
                type="number"
                maxLength="3"
                value={selectedId}
                onChange={(e) => {
                  setSelectedId(e.target.value);
                  if (e.target.value.length <= 3) {
                    fetchIconById(e.target.value);
                  }
                }}
                placeholder="Digite o ID do ícone"
                className="icon-editor-input"
                required
              />
            </div>
              {imagePreview && (
                  <div className="view-icon">
                    <label className="icon-editor-label-imagem">Imagem Preview:</label>
                    <img src={imagePreview} alt="Imagem preview" className="icon-editor-img-preview" />
                  </div>
                )}

              {creationDate && (
                <div className="form-group">
                  <label className="icon-editor-label">Data de Criação:</label>
                  <input
                    type="text"
                    value={new Date(creationDate).toLocaleString()}
                    readOnly
                    className="icon-editor-input"
                  />
                </div>
              )}

              {modificationDate && (
                <div className="form-group">
                  <label className="icon-editor-label">Última Modificação:</label>
                  <input
                    type="text"
                    value={new Date(modificationDate).toLocaleString()}
                    readOnly
                    className="icon-editor-input"
                  />
                </div>
              )}

              <div className="form-group">
                <label className="icon-editor-label">Descrição:</label>
                <input
                  type="text"
                  name="descricao"
                  value={formData.descricao}
                  onChange={handleChange}
                  placeholder="Digite a descrição do ícone"
                  className="icon-editor-input"
                  required
                />
              </div>
              <div className="form-group">
                <label className="icon-editor-label">Novo Ícone:</label>
                <input
                  type="file"
                  name="src"
                  onChange={handleChange}
                  accept="image/*"
                  className="icon-editor-input-file"
                />
              </div>
            <div>
              <button type="submit" className="icon-editor-button-atualizar">Atualizar</button>
              <button type="button" onClick={handleDelete} className="icon-editor-button-deletar">Deletar</button>
            </div>
          </>
        )}
      </form>
    </div>
  );
};

export default IconEditor;
