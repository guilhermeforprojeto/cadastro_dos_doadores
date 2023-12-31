import React, { useState, useEffect } from 'react';
import './frenteAssistidosForm.css'
import { API } from '../../../assets/api/api';
import Notify from '../../../components/react-toastify/react-toastify';
import { Noti } from '../../../components/react-toastify/Noti';
import {
  readItemFromStorage,
} from '../../../services/storage/storage';
import { Doador } from '../doador/doador';
import { tFrenteAssistidos } from './frenteassistidos';


const FrenteAssistidosForm: React.FC = () => {
  const [frentesList, setFrentesList] = useState<tFrenteAssistidos[]>([]);

  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [noti, setNoti] = useState<Noti>({ tipo: '', msg: '' });

  const [handleformData, setHandleFormData] = useState<any>({
    id: '',
    nome: '',
    assistidosSelecionados: [],
    assistidos: '',
  });
  const [formData, setFormData] = useState<tFrenteAssistidos>({

    id: handleformData.id,
    nome: handleformData.nome,
    assistidos: handleformData.assistidosSelecionados,

  });
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (e.target.name === "assistidos") {

      setHandleFormData({
        ...handleformData,
        assistidosSelecionados: [...handleformData.assistidosSelecionados, handleformData.assistidos],
        assistidos: '',
      });
    }
    console.log(e.target.name)

    setHandleFormData({ ...handleformData, [e.target.name]: e.target.value });
  };
  const handleEditClick = (id: string) => {
    setEditingItemId(id);
    // Preencha os campos de edição com os dados atuais da sacola
    const sacolaAtual = frentesList.find((sacola) => sacola.id === id);
    if (sacolaAtual) {
      setFormData({ ...formData, ...sacolaAtual });
    }
  };
  const handleSaveEdit = async (id: string) => {
    try {
      const response = await API.put('/frente-assistida/' + id, formData); // Substitua pela sua rota de API
      loadFrenteAss();
      setFrentesList([
        {
          id: '',
          nome: '',
          assistidos: ['']
        }
      ])
      setFormData({
        id: '',
        nome: '',
        assistidos: ['']
      });
      setNoti({ tipo: "success", msg: response.data.message })
      // if (response.status === 201) {
      //   setNoti({ tipo: "success", msg: response.data.message })
      //   console.log('Sacola criada com sucesso!', response.data.message);
      // } else {
      //   console.error('Erro ao criar sacola:', response.data.message);
      // }
    }
    catch (error) {
      setNoti({ tipo: "error", msg: "Erro ao criar sacola" })
      console.error('Erro ao criar sacola:', error);
    }
    // Implemente a lógica para salvar as alterações na sacola com o ID especificado
    // Normalmente, você faria uma chamada à API para atualizar os dados no servidor
    // Aqui, você pode apenas cancelar o modo de edição
    setEditingItemId(null);
  };

  const handleDelete = async (FRENTE: tFrenteAssistidos) => {
    try {
      await API.delete(`/frente-assistida/${FRENTE.id}`); // Substitua pela sua rota de API
      setNoti({ tipo: "success", msg: "FRENTE " + FRENTE.nome + " deletada com suceso" })
      loadFrenteAss();
    } catch (error) {
      setNoti({ tipo: "error", msg: "Não foi possivel apagar " })
      console.error('Erro ao excluir FRENTE:', error);
    }
  };



  const [dataHoraAtual, setDataHoraAtual] = useState(new Date());

  // Atualiza a data e hora a cada segundo
  useEffect(() => {
    // setFormData(formData)
    const interval = setInterval(() => {
      setDataHoraAtual(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);
  const SaveForm = async () => {
    handleAdicionarSacolinha()
    try {
      const response = await API.post('/frente-assistida', formData); // Substitua pela sua rota de API
      // loadFrenteAss();
      setFormData({
        id: '',
        nome: '',
        assistidos: [],
      });
      setHandleFormData({
        id: '',
        nome: '',
        assistidosSelecionados: [],
        assistidos: '',
      })
      setNoti({ tipo: "success", msg: response.data.message })

      if (response.status === 201) {
        loadFrenteAss()
        setNoti({ tipo: "success", msg: response.data.message })
        console.log('Sacola criada com sucesso!', response.data.message);
      } else {
        console.error('Erro ao criar sacola:', response.data.message);
      }
    }
    catch (error) {
      setNoti({ tipo: "error", msg: "Erro ao criar sacola" })
      console.error('Erro ao criar sacola:', error);
    }

  }
  const handleSubmit = async (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | React.FormEvent) => {
    e.preventDefault();
  };

  useEffect(() => {
    loadFrenteAss();
  }, []);

  const loadFrenteAss = async () => {
    try {
      const response = await API.get('/frente-assistida'); // Substitua pela sua rota de API
      // setSacolasOP(response.data);
      setFrentesList(response.data.frenteAssistida)
      setSacolasOP(response.data.frenteAssistida)
      console.log(response.data.frenteAssistida)
      setNoti({ tipo: "info", msg: response.data.message })
      // console.log(response)
    } catch (error) {
      console.error('Erro ao carregar sacolas:', error);
    }
  };
  interface OpcaoSacolinha {
    codigo: string;
  }
  const [sacolasOP, setSacolasOP] = useState<OpcaoSacolinha[]>([])


  const handleAdicionarSacolinha = () => {


    if (handleformData.assistidos && !handleformData.assistidosSelecionados.includes(handleformData.assistidos)) {
      setHandleFormData({
        ...handleformData,
        assistidosSelecionados: [...handleformData.assistidosSelecionados, handleformData.assistidos],
        assistidos: '',
      });
      setFormData({
        id: handleformData.id,
        nome: handleformData.nome,
        assistidos: [...handleformData.assistidosSelecionados, handleformData.assistidos]
      })
      console.log(handleformData.assistidos.length === 0)
      // setHandleFormData({
      //   id: '',
      //   // nome: '',
      //   contato: '',
      //   assistidosSelecionados: [],
      //   assistidos: '',
      // })
    } else {
      if (handleformData.assistidos.length > 0) {
        setNoti({ tipo: 'warning', msg: 'Assistido já foi informado' })
      }
      console.error("Assistido já foi informado!")

    }
    // setFormData({
    //   id: handleformData.id,
    //   nome: handleformData.nome,
    //   assistidos: handleformData.assistidosSelecionados,
    // })
    // setHandleFormData({
    //   ...handleformData,
    //   assistidosSelecionados: [...handleformData.assistidosSelecionados, handleformData.assistidos],
    //   assistidos: '',
    // });
  };

  const handleRemoverSacolinha = (sacolinha: string) => {
    const novaListaSacolinhas = handleformData.assistidosSelecionados.filter(
      (item: string) => item !== sacolinha
    );

    setHandleFormData({
      ...handleformData,
      assistidosSelecionados: novaListaSacolinhas,
    });
  };


  // const options = sacolasOP.map((opcao: any) => {
  //   const valores: Array<string> = opcao.assistidos;
  //   return valores.map((valor: string) => (
  //     <option key={valor} value={valor}>
  //       {valor}
  //     </option>
  //   ));
  // });

  return (<>
    <Notify notificacao={noti} />
    <div className='container-headerFrenteAss'>Assiste responsavel: {readItemFromStorage("NomeAssistente")} em {dataHoraAtual.toLocaleString('pt-BR', {
      timeZone: 'America/Sao_Paulo',
      dateStyle: 'long',
      timeStyle: 'medium'
    })} </div>
    <div className='containerFrenteAss'>
      <h1>Cadastro de Frente Assistido</h1>
      <form className='containerFrenteAss-form' onSubmit={handleSubmit}>

        <div>
          <label>Nome</label>
          <input
            type="text"
            name="nome"
            value={handleformData.nome}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <div>
            <label>Informe 1 nome por vez e adcione</label>
            <input
              type="text"
              name="assistidos"
              value={handleformData.assistidos}
              onChange={handleChange}
            // required
            />
            <button onClick={handleAdicionarSacolinha}>Adicionar Assistido</button>
          </div>
          <div>
            <hr></hr>
            <label>Assistidos informados:</label>
            <ul>
              {handleformData.assistidosSelecionados.map((sacolinha: any | React.Key | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined) => (
                <li key={sacolinha.id}>
                  {sacolinha}
                  <button onClick={() => handleRemoverSacolinha(sacolinha)}>
                    Remover
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <hr></hr>
        <label>Finalizar</label>
        <div className='btncontainerFrenteAss'>
          <button type='reset' >Limpar</button>
          <button type='submit' onClick={SaveForm}>Salvar</button>
        </div>
      </form>
    </div>
    {/* Lista */}
    <div className='tableContainerFrenteAss' >
      <label>Listgem - Frentes Cadastradas</label>
      <table>
        <thead>
          <tr>
            <th>Código</th>
            <th>Assistidos</th>
            <th>Ação</th>
          </tr>
        </thead>
        {formData.id.length == 0 ?
          frentesList.map((sacola) => (
            <tbody className='tbodyFrentesAss'>
              <tr key={sacola.id}>
                <td>
                  {editingItemId === sacola.id ? (
                    <div>
                      <label>Frente</label>
                      <input
                        type="text"
                        name="nome"
                        value={formData.nome}
                        onChange={handleChange}
                      />
                    </div>
                  ) : (
                    <div><label>Frente Assistida: </label> {sacola.nome}</div>
                  )}
                </td>
                <td>
                  {editingItemId === sacola.id ? (
                    <input
                      type="text"
                      name="assistidos"
                      value={formData.assistidos}
                      onChange={handleChange}
                    />) : (
                    <div><label>Assistidos:</label> {sacola.assistidos.join(", ")}</div>
                  )}
                </td>

                <td className="actbtn">
                  {/* {editingItemId === sacola.id ? (
                    <button onClick={() => handleSaveEdit(sacola.id)}>Salvar</button>
                  ) : (
                    <button onClick={() => handleEditClick(sacola.id)}>Editar</button>
                  )} */}
                  <details>
                    <summary>Exluir</summary>
                    <button onClick={() => handleDelete(sacola)}>Confirmar Exclusão</button>
                  </details>
                </td>
              </tr>
            </tbody>
          ))
          : <span><h1>Não existe Frentes cadastradas</h1></span>}
      </table>
    </div>

  </>
  );
};


export default FrenteAssistidosForm;
