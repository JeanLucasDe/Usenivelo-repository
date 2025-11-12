import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Link,useNavigate } from 'react-router-dom';
import { ArrowRight, CheckCircle, Star, Zap, Shield, Users, BarChart3, Smartphone, Globe, Award, MessageCircle, Mail, Phone, MapPin, LogOut, LayoutDashboard, Settings, Database, Calculator, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import image_main_landing from "../images/image_main_landing.png"
import Header from './componentsPages/Header';
import LogoNiveloWhite from "../images/LogoNiveloWhite.png"
import Plans from './componentsPages/Plans';


const LandingPage = () => {
  const { user, signOut, userRole } = useAuth();
  const navigate = useNavigate();
  const {
    toast
  } = useToast();
  const handleFeatureClick = () => {
    toast({
      title: "🚧 Funcionalidade em desenvolvimento",
      description: "Esta funcionalidade estará disponível em breve! Entre em contato para mais informações."
    });
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/');
    toast({ title: "Logout realizado", description: "Você foi desconectado com sucesso" });
  };
  return <>
      <Helmet>
        <title>Nivelo - Plataforma de Gestão Empresarial Completa</title>
        <meta name="description" content="Transforme sua empresa com nossa plataforma SaaS completa. Gestão de clientes, financeiro, agendamentos e muito mais em um só lugar." />
      
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        {/* Header */}
        <Header user={user} handleLogout={handleLogout}/>

        {/* Hero Section */}
        <section className="pt-32 pb-20 px-4">
          <div className="container mx-auto text-center">
            <motion.div initial={{
            opacity: 0,
            y: 30
          }} animate={{
            opacity: 1,
            y: 0
          }} transition={{
            duration: 0.8
          }} className="max-w-4xl mx-auto">
              <h1 className="text-5xl md:text-7xl font-bold mb-6">
                <span className="text-gradient">Nivelo</span>
                <br />
                <span className="text-gray-800 dark:text-white">Gestão Modular Empresarial</span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
                A flexibilidade que sua gestão precisa. A performance que seu negócio merece.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                <Link to="/register">
                  <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-lg px-8 py-4">
                    Grátis por 30 dias
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
              </div>

              <div className="flex items-center justify-center space-x-8 text-sm text-gray-500">
               
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  Configuração personalizada
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  Suporte 24/7
                </div>
              </div>
            </motion.div>

            <motion.div initial={{
              opacity: 0,
              y: 50
              }} animate={{
                opacity: 1,
                y: 0
              }} transition={{
                duration: 1,
                delay: 0.3
              }} className="mt-16">
                <img className="mx-auto rounded-2xl shadow-2xl max-w-4xl w-full animate-float" alt="Dashboard da plataforma Nivelo" src={image_main_landing} />
            </motion.div>
          </div>
        </section>

        

        {/* Recursos */}
        <section id="recursos" className="py-20 px-4">
          <div className="container mx-auto">
            <motion.div initial={{
            opacity: 0,
            y: 30
          }} whileInView={{
            opacity: 1,
            y: 0
          }} viewport={{
            once: true
          }} className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gradient">
                Recursos Poderosos
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                Tudo que você precisa para transformar sua empresa em uma máquina de resultados
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[{
  icon: LayoutDashboard,
  title: "Gestão Modular",
  description: "Monte seus próprios módulos e fluxos de trabalho conforme as necessidades da sua empresa."
}, {
  icon: Settings,
  title: "Campos Personalizados",
  description: "Adicione e edite campos e subcampos livremente, criando estruturas únicas para cada tipo de dado."
}, {
  icon: Database,
  title: "Registros Dinâmicos",
  description: "Cadastre, edite e atualize registros em tempo real com total controle e automação inteligente."
}, {
  icon: Calculator,
  title: "Campos Calculados",
  description: "Crie operações automáticas entre campos e receba resultados instantâneos nos seus formulários."
}, {
  icon: Filter,
  title: "Busca e Filtros Avançados",
  description: "Encontre qualquer informação rapidamente com filtros personalizados e pesquisa inteligente."
}, {
  icon: BarChart3,
  title: "Dashboard Interativo",
  description: "Visualize resultados e métricas em tempo real com gráficos e painéis totalmente integrados."
              }].map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg card-hover cursor-pointer"
                >
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center mb-6">
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-4">{feature.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300">{feature.description}</p>
                </motion.div>
              ))}

            </div>
          </div>
        </section>

        {/* Promoção de Lançamento */}
        <section className="py-16 bg-gradient-to-r from-orange-500 to-red-500 text-white">
          <div className="container mx-auto px-4 text-center">
            <motion.div initial={{
            opacity: 0,
            scale: 0.9
          }} whileInView={{
            opacity: 1,
            scale: 1
          }} viewport={{
            once: true
          }} className="max-w-3xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                🚀 Oferta de Lançamento Limitada!
              </h2>
              <p className="text-xl mb-6">
                50% OFF nos primeiros 3 meses + Preço vitalício para os 50 primeiros clientes
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/register">
                  <Button size="lg" className="bg-white text-orange-600 hover:bg-gray-100">
                    Garantir Desconto Agora
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </section>

        <section id="plans"><Plans/></section>  

        {/* Depoimentos */}
        <section id="depoimentos" className="py-20 px-4">
          <div className="container mx-auto">
            <motion.div initial={{
            opacity: 0,
            y: 30
          }} whileInView={{
            opacity: 1,
            y: 0
          }} viewport={{
            once: true
          }} className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gradient">
                O que nossos clientes dizem
              </h2>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8">
              {[{
              name: "Maria Silva",
              company: "TechStart Ltda",
              text: "Aumentamos nossa produtividade em 300% após implementar o Nivelo. A automação é incrível!",
              rating: 5
            }, {
              name: "João Santos",
              company: "Consultoria Pro",
              text: "A customização dos módulos nos permitiu criar exatamente o que precisávamos. Fantástico!",
              rating: 5
            }, {
              name: "Ana Costa",
              company: "E-commerce Plus",
              text: "O suporte é excepcional e a plataforma é muito intuitiva. Recomendo para todos!",
              rating: 5
            }].map((testimonial, index) => <motion.div key={index} initial={{
              opacity: 0,
              y: 30
            }} whileInView={{
              opacity: 1,
              y: 0
            }} viewport={{
              once: true
            }} transition={{
              delay: index * 0.1
            }} className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg card-hover">
                  <div className="flex items-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />)}
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 mb-6 italic">
                    "{testimonial.text}"
                  </p>
                  <div>
                    <p className="font-bold">{testimonial.name}</p>
                    <p className="text-sm text-gray-500">{testimonial.company}</p>
                  </div>
                </motion.div>)}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-20 px-4 bg-gray-50 dark:bg-gray-800">
          <div className="container mx-auto max-w-4xl">
            <motion.div initial={{
            opacity: 0,
            y: 30
          }} whileInView={{
            opacity: 1,
            y: 0
          }} viewport={{
            once: true
          }} className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-9 text-gradient">
                Perguntas Frequentes
              </h2>
            </motion.div>

            <div className="space-y-6">
              {[{
              question: "Como funciona o período de teste gratuito?",
              answer: "Você tem 30 dias completos para testar todas as funcionalidades sem limitações. Não é necessário cartão de crédito."
            }, {
              question: "Posso cancelar a qualquer momento?",
              answer: "Sim, você pode cancelar sua assinatura a qualquer momento sem taxas ou multas."
            }, {
              question: "Os dados ficam seguros?",
              answer: "Absolutamente. Utilizamos criptografia de ponta e seguimos todas as normas da LGPD para proteger seus dados."
            }, {
              question: "Há limite de uso de dados?",
              answer: "Depende do plano escolhido."
            }].map((faq, index) => <motion.div key={index} initial={{
              opacity: 0,
              y: 20
            }} whileInView={{
              opacity: 1,
              y: 0
            }} viewport={{
              once: true
            }} transition={{
              delay: index * 0.1
            }} className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-lg cursor-pointer card-hover">
                  <h3 className="text-lg font-bold mb-2">{faq.question}</h3>
                  <p className="text-gray-600 dark:text-gray-300">{faq.answer}</p>
                </motion.div>)}
            </div>
          </div>
        </section>

        {/* Contato */}
        <section id="contato" className="py-20 px-4">
          <div className="container mx-auto">
            <motion.div initial={{
            opacity: 0,
            y: 30
          }} whileInView={{
            opacity: 1,
            y: 0
          }} viewport={{
            once: true
          }} className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gradient">
                Entre em Contato
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300">
                Estamos aqui para ajudar você a transformar seu negócio
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
              <motion.div initial={{
              opacity: 0,
              x: -30
            }} whileInView={{
              opacity: 1,
              x: 0
            }} viewport={{
              once: true
            }} className="space-y-8">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                    <Mail className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold">Email</h3>
                    <p className="text-gray-600 dark:text-gray-300">contato@usenivelo.com</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                    <Phone className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold">Telefone</h3>
                    <p className="text-gray-600 dark:text-gray-300">(71) 98129-8548</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                    <MapPin className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold">Endereço</h3>
                    <p className="text-gray-600 dark:text-gray-300">Salvador, BA - Brasil</p>
                  </div>
                </div>
              </motion.div>

              <motion.div initial={{
              opacity: 0,
              x: 30
            }} whileInView={{
              opacity: 1,
              x: 0
            }} viewport={{
              once: true
            }} className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg">
                <form className="space-y-6" onSubmit={e => {
                e.preventDefault();
                toast({
                  title: "Mensagem enviada!",
                  description: "Entraremos em contato em breve."
                });
              }}>
                  <div>
                    <label className="block text-sm font-medium mb-2">Nome</label>
                    <input type="text" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Email</label>
                    <input type="email" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Mensagem</label>
                    <textarea rows={4} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent" required />
                  </div>
                  <Button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                    Enviar Mensagem
                  </Button>
                </form>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-gray-900 text-white py-12 px-4">
          <div className="container mx-auto">
            <div className="grid md:grid-cols-4 gap-8">
              <div>
                <div className="flex items-center space-x-2 mb-4">
                  <div className="w-14 h-14 rounded-lg flex items-center justify-center">
                    <img src={LogoNiveloWhite}/>
                  </div>
                  <span className="text-xl font-bold">Nivelo</span>
                </div>
                <p className="text-gray-400">
                  Transformando negócios com tecnologia de ponta e inovação constante.
                </p>
              </div>

              <div>
                <h3 className="font-bold mb-4">Produto</h3>
                <ul className="space-y-2 text-gray-400">
                  <li><a href="#recursos" className="hover:text-white transition-colors">Recursos</a></li>
                  <li><a href="#planos" className="hover:text-white transition-colors">Planos</a></li>
                  <li><button onClick={handleFeatureClick} className="hover:text-white transition-colors">Segurança</button></li>
                </ul>
              </div>

              <div>
                <h3 className="font-bold mb-4">Empresa</h3>
                <ul className="space-y-2 text-gray-400">
                  <li><button onClick={handleFeatureClick} className="hover:text-white transition-colors">Sobre</button></li>
                  <li><a href="#contato" className="hover:text-white transition-colors">Contato</a></li>
                </ul>
              </div>

              <div>
                <h3 className="font-bold mb-4">Suporte</h3>
                <ul className="space-y-2 text-gray-400">
                  <li><button onClick={handleFeatureClick} className="hover:text-white transition-colors">Central de Ajuda</button></li>
                  <li><Link to='/documentation'><button className="hover:text-white transition-colors">Documentação</button></Link></li>
                </ul>
              </div>
            </div>

            <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
              <p className="text-gray-400">
                © 2025 Nivelo. Todos os direitos reservados.
              </p>
              <div className="flex space-x-6 mt-4 md:mt-0">
                <button onClick={handleFeatureClick} className="text-gray-400 hover:text-white transition-colors">Termos e privacidade</button>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>;
};
export default LandingPage;