import React, { useState, useEffect } from 'react';
import './sacolaForm.css'
import { tSacola } from './scacola';
import { ToastContainer, toast } from 'react-toastify';
import { API } from '../../../assets/api/api';
import Notify from '../../../components/react-toastify/react-toastify';
import { Noti } from '../../../components/react-toastify/Noti';
import { tFrenteAssistidos } from '../frente-assistidos/frenteassistidos';
import { readItemFromStorage } from '../../../services/storage/storage';

const SacolaForm: React.FC = () => {
  const [sacolas, setSacolas] = useState<tSacola[]>([]);
  const [noti, setNoti] = useState<Noti>({ tipo: '', msg: '' });
  const cNomeAssistente: string = readItemFromStorage('NomeAssistente')

  const [frenteAss, setFrenteAss] = useState<tFrenteAssistidos[]>([])
  const [formData, setFormData] = useState<tSacola>({
    id: '',
    codigo: '',
    status: '',
    assistentesocial: '',
    nomefrenteassistida: '',
    assistido: '',
    doador: '',
    obs: ''
  });
  const [editingItemId, setEditingItemId] = useState<string | null>(null);

  const [dataassistidos, setDataassitidos] = useState<any[]>([])

  const loadFrenteAssistida = async () => {
    try {
      const response = await API.get('/frente-assistida/'); // Substitua pela sua rota de API
      setFrenteAss(response.data.frenteAssistida);
      setNoti({ tipo: "info", msg: response.data.message })
      // console.log(response)
    } catch (error) {
      console.error('Erro ao carregar sacolas:', error);
    }
  };
  const loadAssistidos = async (id: string) => {
    try {
      const response = await API.get('/frente-assistida/' + id); // Substitua pela sua rota de API
      setDataassitidos(response.data.frenteAssistida.assistidos
      );
      // console.log(dataassistidos)
      setNoti({ tipo: "info", msg: response.data.message })
      // console.log(response)
    } catch (error) {
      console.error('Erro ao carregar sacolas:', error);
    }
  };
  const loadSacolas = async () => {
    try {
      const response = await API.get('/sacolas'); // Substitua pela sua rota de API
      setSacolas(response.data.sacolas);
      setNoti({ tipo: "info", msg: response.data.message })
    } catch (error) {
      console.error('Erro ao carregar sacolas:', error);
    }

    // setFormData({ ...formData, status: 'Registrada' });
    // console.warn('status')
  };

  useEffect(() => {
    loadFrenteAssistida();
    loadSacolas();
    setFormData({ ...formData, assistentesocial: cNomeAssistente[0], status: 'Registrada', doador: '(ñ relacionado)' });
    console.log(formData)
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleFrenteAssistida = (event: any) => {
    setFrenteAssistidaSelecionada(event.target.value);
    setFormData({ ...formData, [event.target.name]: event.target.value });
    const selectedIndex = event.target.selectedIndex;
    const selectedOption = event.target.options[selectedIndex];
    const selectedId = selectedOption.getAttribute("data-id");
    selectedOption.getAttribute("data-id");
    loadAssistidos(selectedId)

  }
  const handleAssistido = (event: any) => {

    setFormData({ ...formData, [event.target.name]: event.target.value });
    console.log(event.target.value)

  }

  const POPULARBANCO = async () => {
    for (let i = 1; i <= 1000; i++) {
      const codigo = `S${i.toString().padStart(4, '0')}`;
      const response = await API.post('/sacolas', {
        codigo,
        status: `DOADOS000${i}`,
        assistentesocial: `assistentesocialS000${i}`,
        nomefrenteassistida: `nomefrenteassistidaS000${i}`,
        assistido: `ASSISITOSS000${i}`,
        doador: `DOADORS000${i}`,
        obs: `OBSERVACAOS000${i}`
      });
      console.warn(response)
    }
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Lógica para criar a sacola aqui

    // Após criar a sacola, redefina o valor selecionado para a primeira opção
    setFrenteAssistidaSelecionada('');
    setDataassitidos([])
    e.preventDefault();
    try {
      const response = await API.post('/sacolas', formData); // Substitua pela sua rota de API
      setNoti({ tipo: "success", msg: response.data.message })
      console.warn(formData)
      loadSacolas();

      setFormData({
        id: '',
        codigo: '',
        status: 'Registrada',
        assistentesocial: cNomeAssistente[0],
        nomefrenteassistida: '',
        assistido: '',
        doador: '(ñ relacionado)',
        obs: ''
      });

      if (response.status === 201) {
        setNoti({ tipo: "success", msg: response.data.message })
        console.log('Sacola criada com sucesso!', response.data.message);
      } else {
        console.error('Erro ao criar sacola:', response.data.message);
        console.warn(formData)

      }
    }
    catch (error) {
      const deuruim: any = error
      setNoti({ tipo: "error", msg: `${deuruim.response.data.message}` })
      console.warn(formData)

      // console.error('Erro ao criar sacola:', error);
      // console.log(error);
      // console.log(deuruim.response.data.message);
    }

  };

  const [frenteAssistidaSelecionada, setFrenteAssistidaSelecionada] = useState('');

  const frenteAssistida = [
    // Seus dados da frente assistida aqui
  ];

  // const handleFrenteAssistida = (event) => {
  //   setFrenteAssistidaSelecionada(event.target.value);
  // };

  // const handleSubmit = (event) => {
  //   event.preventDefault();
  //   // Lógica para criar a sacola aqui

  //   // Após criar a sacola, redefina o valor selecionado para a primeira opção
  //   setFrenteAssistidaSelecionada('');
  // };



  const handleEditClick = (id: string) => {
    setEditingItemId(id);
    // Preencha os campos de edição com os dados atuais da sacola
    const sacolaAtual = sacolas.find((sacola) => sacola.id === id);
    if (sacolaAtual) {
      setFormData({ ...formData, ...sacolaAtual });
    }
  };

  const handleSaveEdit = async (id: string) => {
    try {
      const response = await API.put('/sacolas/' + id, formData); // Substitua pela sua rota de API
      loadSacolas();
      setFrenteAss([
        {
          id: '',
          nome: '',
          assistidos: ['']
        }
      ])
      setFormData({
        id: '',
        codigo: '',
        status: '',
        assistentesocial: '',
        nomefrenteassistida: '',
        assistido: '',
        doador: '',
        obs: ''
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

  const handleDelete = async (sacola: tSacola) => {
    try {
      await API.delete(`/sacolas/${sacola.id}`); // Substitua pela sua rota de API
      setNoti({ tipo: "success", msg: "Sacola " + sacola.codigo + " deletada com suceso" })
      loadSacolas();
    } catch (error) {
      setNoti({ tipo: "error", msg: "Não foi possivel apagar " })
      console.error('Erro ao excluir sacola:', error);
    }
  };

  return (
    <div className='containerSacola'>
      <Notify notificacao={noti} />
      <form className='containerformSacola' onSubmit={handleSubmit}>
        <h1>Cadastro de Sacolinhas</h1>
        <div>
          <label>Código</label>
          <input
            type="text"
            name="codigo"
            value={formData.codigo}
            onChange={handleChange}
            required
          />
        </div>

        <div className='formSelecCelula' >
          <label>Frente Assistida</label>
          <select id="instituicoes" name="instituicoes">
            <option value="Null">Selecione uma frente</option>
            <option value="Manancial de Deboras">Manancial de Deboras</option>
            <option value="Morada do Altíssimo">Morada do Altíssimo</option>
            <option value="Asilo Ananias">Asilo Ananias</option>
            <option value="Fundação Casa Masculina">Fundação Casa Masculina</option>
            <option value="Abrigo Mãos Pequenas Casa 3">Abrigo Mãos Pequenas Casa 3</option>
            <option value="Abrigo Mãos Pequenas Casa 4">Abrigo Mãos Pequenas Casa 4</option>
            <option value="Abrigo Mãos Pequenas Casa 5">Abrigo Mãos Pequenas Casa 5</option>
            <option value="Asilo Nosso Lar">Asilo Nosso Lar</option>
            <option value="Tanque de Betesda">Tanque de Betesda</option>
            <option value="Fundação Casa Feminina">Fundação Casa Feminina</option>
            <option value="Presídio CDP">Presídio CDP</option>
            <option value="Albergue">Albergue</option>
            <option value="Tamarutaca">Tamarutaca</option>
            <option value="Pão da Vida">Pão da Vida</option>
          </select>
          {/* <select value={frenteAssistidaSelecionada} name="nomefrenteassistida" onChangeCapture={handleFrenteAssistida}>
            <option> Seleciona uma frente assistida</option>
            {frenteAss.map((opcao) => (
              <option key={opcao.id} data-id={opcao.id} value={opcao.nome}>
                {opcao.nome}
              </option>
            ))}

          </select> */}
        </div>
        <div className='formSelecCelula'>
          <label>Nome Assistido</label>
          <input type='text'>
          </input>
          {/* <select name="assistido" onChange={handleAssistido} >
            <option value=''>Selecione uma frente primeiro</option>
            {dataassistidos.map((assistido: any) => (
              <option key={assistido.id} value={assistido}>
                {assistido}
              </option>
            ))}
          </select> */}
        </div>
        {/* <div  >
          <label>Observações</label>
          <input
            type="text"
            name="obs"
            value={formData.obs}
            onChange={handleChange}
            required
          />
        </div> */}

        <button type="submit">Criar Sacola</button>
        <br></br>
        <button >Limpar </button>
        <br></br>
        {/* <button onClick={POPULARBANCO}>CUIDADO!! Adiconar 1000 sacolas!!! </button> */}
      </form>

      <br></br>
      <hr />
      {/* LISTA 
      LISTA 
      LISTA  */}
      <h2>Lista  Sacolas</h2>
      <table>
        <thead>
          <tr>
            <th>Status</th>
            <th>Código</th>
            <th>Frente Assistida( editar precisa de lista)</th>
            <th>Assistido</th>
            <th>Doador</th>
            <th>Assistente</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {sacolas.map((sacola) => (
            <tr key={sacola.id}>
              <td>
                {editingItemId === sacola.id ? (
                  <input
                    type="text"
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                  />
                ) : (
                  sacola.status
                )}
              </td>
              <td>
                {editingItemId === sacola.id ? (
                  <input
                    type="text"
                    name="codigo"
                    value={formData.codigo}
                    onChange={handleChange}
                  />
                ) : (
                  sacola.codigo
                )}
              </td>
              <td>
                {editingItemId === sacola.id ? (
                  <input
                    type="text"
                    name="nomefrenteassistida"
                    value={formData.nomefrenteassistida}
                    onChange={handleChange}
                  />
                ) : (
                  sacola.nomefrenteassistida
                )}
              </td>
              <td>
                {editingItemId === sacola.id ? (
                  <input
                    type="text"
                    name="assistido"
                    value={formData.assistido}
                    onChange={handleChange}
                  />
                ) : (
                  sacola.assistido
                )}
              </td>
              <td>
                {editingItemId === sacola.id ? (
                  <input
                    type="text"
                    name="doador"
                    value={formData.doador}
                    onChange={handleChange}
                  />
                ) : (
                  sacola.doador
                )}
              </td>
              <td>
                {editingItemId === sacola.id ? (
                  <input
                    type="text"
                    name="assistentesocial"
                    value={formData.assistentesocial}
                    onChange={handleChange}
                  />
                ) : (
                  sacola.assistentesocial
                )}
              </td>

              <td>
                {/* {editingItemId === sacola.id ? (
                  <button onClick={() => handleSaveEdit(sacola.id)}>Salvar</button>
                ) : (
                  <button onClick={() => handleEditClick(sacola.id)}>Editar</button>
                )} */}
                <button onClick={() => handleDelete(sacola)}>Excluir</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SacolaForm;
