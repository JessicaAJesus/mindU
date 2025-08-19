import React, { useState, useEffect } from 'react';
import "../css/AgendarConsulta.css";
import { Container, Col, Row, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import axios from 'axios';
import BAPO from "../Components/WidgetBAPO";
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import padraoPerfil from '../img/padraoPerfil.png';
import FiltroBusca from '../Components/FiltroAgendarConsulta';
import { useNavigate } from "react-router-dom";
import { parseJwt } from "../Components/jwtUtils";
import { Pencil } from 'lucide-react';
import { Plus } from 'lucide-react';

function AgendarConsulta() {
    const [activeTabs, setActiveTabs] = useState({});
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('');
    const [selectedProfession, setSelectedProfession] = useState('');
    const [data, setData] = useState([]);

    // Estados para edição
    const [editableInfo, setEditableInfo] = useState({});
    const [editedText, setEditedText] = useState({});
    const [editableSpecialties, setEditableSpecialties] = useState({});
    const [specialtiesList, setSpecialtiesList] = useState({});

    const [perfil, setPerfil] = useState('');
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    useEffect(() => {
        if (token) {
            const decodedToken = parseJwt(token);
            setPerfil(decodedToken);
        }
    }, [token]);

    useEffect(() => {
        axios.get('http://localhost:3001/psicologos')
            .then(response => {
                const updatedData = response.data.map(psicologo => ({
                    ...psicologo,
                    // Garante que especificidade seja sempre um array
                    especificidade: Array.isArray(psicologo.especificidade)
                        ? psicologo.especificidade
                        : (psicologo.especificidade ? psicologo.especificidade.split(',').map(s => s.trim()) : [])
                }));
                setData(updatedData);
            })
            .catch(error => {
                console.error("Erro ao buscar os dados:", error);
            });
    }, []); // Este useEffect busca os dados uma vez quando o componente monta

    const handleEditToggle = (psicologoId) => {
        setEditableInfo(prev => ({ ...prev, [psicologoId]: !prev[psicologoId] }));
        if (!editableInfo[psicologoId]) {
            const psicologo = data.find(p => p.psicologo_id === psicologoId);
            setEditedText(prev => ({ ...prev, [psicologoId]: psicologo.biografia || '' }));
        }
    };

    const handleTextChange = (psicologo_id, value) => {
        setEditedText(prev => ({ ...prev, [psicologo_id]: value }));
    };

    const handleSaveEdit = async (psicologo_id) => {
        const updatedBiografia = editedText[psicologo_id];
        if (!updatedBiografia || updatedBiografia.trim() === '') {
            alert('Por favor, preencha a biografia antes de salvar.');
            return;
        }
        try {
            await axios.put(`http://localhost:3001/api/biografia/${psicologo_id}`, { biografia: updatedBiografia });
            setData(prevData => prevData.map(p =>
                p.psicologo_id === psicologo_id ? { ...p, biografia: updatedBiografia } : p
            ));
            setEditableInfo(prev => ({ ...prev, [psicologo_id]: false }));
        } catch (error) {
            console.error('Erro ao salvar a biografia:', error);
            alert('Ocorreu um erro ao salvar a biografia.');
        }
    };

    const handleSpecialtyEditToggle = (psicologo_id) => {
        setEditableSpecialties(prev => ({ ...prev, [psicologo_id]: !prev[psicologo_id] }));
        if (!editableSpecialties[psicologo_id]) {
            const psicologo = data.find(p => p.psicologo_id === psicologo_id);
            setSpecialtiesList(prev => ({ ...prev, [psicologo_id]: psicologo.especificidade || [''] }));
        }
    };
    
    const handleSpecialtyChange = (psicologo_id, index, value) => {
        setSpecialtiesList(prevState => {
            const updatedSpecialties = [...(prevState[psicologo_id] || [])];
            updatedSpecialties[index] = value;
            return { ...prevState, [psicologo_id]: updatedSpecialties };
        });
    };

    const addSpecialtyField = (psicologo_id) => {
        setSpecialtiesList(prevState => ({
            ...prevState,
            [psicologo_id]: [...(prevState[psicologo_id] || []), '']
        }));
    };

    const handleSaveSpecialtyEdit = async (psicologo_id) => {
        const updatedSpecialties = (specialtiesList[psicologo_id] || []).filter(s => s.trim() !== '');
        if (updatedSpecialties.length === 0) {
            alert('Por favor, adicione pelo menos uma especialidade.');
            return;
        }
        const psicologoData = { especificidade: updatedSpecialties.join(', ') };
        try {
            await axios.put(`http://localhost:3001/api/especificidade/${psicologo_id}`, psicologoData);
            setData(prevData => prevData.map(p =>
                p.psicologo_id === psicologo_id ? { ...p, especificidade: updatedSpecialties } : p
            ));
            handleSpecialtyEditToggle(psicologo_id);
            alert('Especialidades atualizadas com sucesso!');
        } catch (error) {
            console.error("Erro ao salvar as especialidades:", error);
            alert('Erro ao salvar as informações.');
        }
    };

    const filteredCards = data.filter(psicologo => {
        const term = searchTerm.toLowerCase();
        const isMatchingProfession = selectedProfession === '' || psicologo.especificidade.join(', ').toLowerCase().includes(selectedProfession.toLowerCase());
        const isMatchingSearchTerm = filterType === 'nome' ? psicologo.nome.toLowerCase().includes(term) : filterType === 'local' ? (psicologo.localizacao || '').toLowerCase().includes(term) : true;
        return isMatchingProfession && isMatchingSearchTerm;
    });

    return (
        <>
            <BAPO />
            <FiltroBusca
                filterType={filterType}
                setFilterType={setFilterType}
                selectedProfession={selectedProfession}
                setSelectedProfession={setSelectedProfession}
                professionOptions={professionOptions}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
            />

            <a href="/quiz" style={{ textDecoration: 'none', color: 'inherit' }}>
                <div className="bannerquiz">
                    <h1 className="text-center textBannerQuiz">Muitas opções? Descubra qual o melhor profissional para você!</h1>
                    <button className="botaoBannerQuiz">
                        <span>Clique aqui e descubra</span>
                        <svg width="15px" height="10px" viewBox="0 0 13 10">
                            <path d="M1,5 L11,5"></path>
                            <polyline points="8 1 12 5 8 9"></polyline>
                        </svg>
                    </button>
                </div>
            </a>
            <Container>
                <h2 className='centralizar textroxo textclaro p-4 m-4'>Agendar Consulta</h2>
                <Row>
                    <Col md={12}>
                        {filteredCards.length > 0 ? (
                            filteredCards.map(psicologo => (
                                <div key={psicologo.psicologo_id}>
                                    <Row className="rowCardAgenda">
                                        <img className='imgPerfil' src={psicologo.foto_perfil ? `http://localhost:3001/uploads/${psicologo.foto_perfil}` : padraoPerfil} alt={`Foto de ${psicologo.nome}`} />
                                        <Col md={6} sm={12} className="colCardAgenda">
                                            <div>
                                                <h3 className='nomeAgenda'>{psicologo.nome}</h3>
                                                <p className='profissao'>{psicologo.crp}</p>
                                                <p className='profissao'>{psicologo.especialidade}</p> 
                                                <p className='local'>{psicologo.especificidade.join(', ')}</p>
                                                <p className='local'>{psicologo.localizacao}</p>
                                                <div className="estrelas">
                                                    {[...Array(5)].map((_, i) => (
                                                        <span key={i} className={`star ${i < psicologo.rating ? 'filled' : ''}`}></span>
                                                    ))}
                                                </div>
                                            </div>
                                            <div>
                                                <div className='p-2'>
                                                    <div className='sessao'>Duração da Sessão<br /><b className='hora'>1 Hora</b></div>
                                                </div>
                                            </div>
                                        </Col>

                                        <Col md={6} sm={12} className="tabs-container">
                                            <Tabs
                                                defaultActiveKey="agenda"
                                                id={`tabs-${psicologo.psicologo_id}`}
                                                fill
                                                activeKey={activeTabs[psicologo.psicologo_id] || 'agenda'}
                                                onSelect={(k) => setActiveTabs(prev => ({ ...prev, [psicologo.psicologo_id]: k }))}
                                            >
                                                <Tab className='tabText p-3' eventKey="sobre" title="Sobre Mim">
                                                    {editableInfo[psicologo.psicologo_id] ? (
                                                        <>
                                                            <textarea
                                                                className='textareaSobreMim'
                                                                value={editedText[psicologo.psicologo_id] || ''}
                                                                onChange={(e) => handleTextChange(psicologo.psicologo_id, e.target.value)}
                                                            ></textarea>
                                                            <button className='salvarEdicoes' onClick={() => handleSaveEdit(psicologo.psicologo_id)}>Salvar</button>
                                                        </>
                                                    ) : (
                                                        <div style={{ display: 'flex', alignItems: 'center' }}>
                                                            <p style={{ marginRight: '10px' }}>
                                                                {psicologo.biografia || 'Biografia não informada.'}
                                                            </p>
                                                        </div>
                                                    )}
                                                         <Link to={`/psicologo/${psicologo.psicologo_id}`} className="agendarBot mt-3">Saiba Mais</Link>
                                                </Tab>

                                                <Tab className='tabText p-3' eventKey="especialidades" title="Especialidades">
                                                    {editableSpecialties[psicologo.psicologo_id] ? (
                                                        <div>
                                                            {(specialtiesList[psicologo.psicologo_id] || ['']).map((specialty, index) => (
                                                                <div key={index} className="especialidade-field">
                                                                    <textarea
                                                                        value={specialty}
                                                                        onChange={(e) => handleSpecialtyChange(psicologo.psicologo_id, index, e.target.value)}
                                                                        className="textareaEspecialidades"
                                                                        placeholder="Digite a especialidade"
                                                                    />
                                                                </div>
                                                            ))}
                                                            <div className="adicionarEspecialidade">
                                                                <button onClick={() => addSpecialtyField(psicologo.psicologo_id)} className='botaoAdiconarEspecialidade'>
                                                                    <Plus /> Adicionar
                                                                </button>
                                                                <button className="salvarEdicoes" onClick={() => handleSaveSpecialtyEdit(psicologo.psicologo_id)}>
                                                                    Salvar
                                                                </button>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <div className="especialidades">
                                                            {(psicologo.especificidade && psicologo.especificidade.length > 0) ? (
                                                                psicologo.especificidade.map((specialty, index) => (
                                                                    <div key={index} className="especialidadeNova">{specialty}</div>
                                                                ))
                                                            ) : (
                                                                <p className='especialidade'>Nenhuma especialidade cadastrada.</p>
                                                            )}
                                                        </div>
                                                    )}
                                                </Tab>

                                                <Tab className='tabText p-3' eventKey="agenda" title="Agenda">
                                                    <p>Clique no botão abaixo para ver os horários de {psicologo.nome} e agendar sua consulta.</p>
                                                      <Link to={`/psicologo/${psicologo.psicologo_id}`} className="agendarBot mt-3">Agendar</Link>
                                                </Tab>
                                            </Tabs>
                                        </Col>
                                    </Row>
                                </div>
                            ))
                        ) : (
                            <div className='semResultado'>Nenhum resultado encontrado.</div>
                        )}
                    </Col>
                </Row>
            </Container>
        </>
    );
}

const professionOptions = [
    "Psicólogo Psicanalista", "Psicólogo Cognitivo", "Psicóloga Clínica",
    "Psicólogo Clínico", "Psicóloga Escolar", "Psicóloga Organizacional",
];

export default AgendarConsulta;