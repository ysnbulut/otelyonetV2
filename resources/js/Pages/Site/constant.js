import LogoImg from './assets/logo.png'
import IntroImg from './assets/screen.png'
import AboutImg from './assets/undraw2.svg'
import CheckImg from './assets/check.png'
import NetworkImg from './assets/network.png'
import GroupImg from './assets/group.png'
import PaymentImg from './assets/payment.png'
import WebImg from './assets/web.png'
import WheelImg from './assets/wheel.png'
import DiscountImg from './assets/discount.png'
import HistoryImg from './assets/history.png'
import ContactImg from './assets/contact.png'
import PlanImg from './assets/pricing-plan.svg'
import ServicesImg from './assets/server.svg'
import ReferancesImg from './assets/hotel-sea.jpg'
import Ref1Img from './assets/ref1.png'
import Ref2Img from './assets/ref2.png'
import Ref3Img from './assets/ref3.png'
import Ref4Img from './assets/ref4.png'
import Ref5Img from './assets/ref5.png'
import ContactFormImg from './assets/mail.svg'
import AmericanExpressImg from './assets/american-express.svg'
import MasterCardImg from './assets/master-card.svg'
import PaypalImg from './assets/paypal.svg'
import VisaImg from './assets/visa.svg'
import WiseImg from './assets/wise.svg'

const logoImg = LogoImg

const navLinks = [
	{hash: '#hakkimizda', title: 'Hakkımızda'},
	{hash: '#ozellikler', title: 'Özellikler'},
	{hash: '#paketler', title: 'Paketler'},
	{hash: '#hizmetler', title: 'Hizmetler'},
	{hash: '#referanslar', title: 'Referanslar'},
	{hash: '#iletisim', title: 'İletişim'},
]

const mobileMenuTitle = 'Otel Yönet'

const headerButton1 = {
	title: 'Demo Talebi',
	url: 'https://tiksoft.com.tr/',
}

const headerButton2 = {
	title: 'Giriş Yap',
	url: 'https://tiksoft.com.tr/',
}

const introSlogan = {
	regular: ["Türkiye'nin", 'En Geniş Kapsamlı'],
	bold: ['Otel Yönetim Sistemi'],
	description: ['Otel Yönet, web tabanlı, bulutta çalışan ve tüm operasyonları kapsayan, yenilikçi ve uçtan uca tam entegre bir otel yönetim sistemidir.'],
}

const introButton = {
	title: 'Paketleri İncele',
	url: '#paketler',
}

const introImg = IntroImg

const aboutImg = AboutImg

const aboutContent = {
	subtitle: 'Hakkımızda',
	title: 'Otel Yönet: Misyonumuz & Vizyonumuz',
	description: [
		'Otel Yönet olarak misyonumuz, yenilikçi teknoloji ve olağanüstü müşteri hizmetleriyle otel işletmelerine en üst düzeyde verimlilik ve konuk deneyimi sunarak onların başarısını maksimize etmektir. Her müşterimizin benzersiz ihtiyaçlarını anlamayı ve onlara özel çözümler sunmayı taahhüt ederiz.',
		'OtelYonet olarak vizyonumuz, dünya çapında konaklama sektörünün öncüsü olmak ve yenilikçi yönetim çözümleriyle sektör standartlarını yükseltmektir. Sektördeki değişimleri öngörerek ve sürekli gelişim ilkesiyle hareket ederek, otel işletmelerinin gelecekteki başarısını şekillendirmeyi hedefliyoruz.',
	],
}

const aboutStats = [
	{
		count: 146,
		title: 'Otelin Tercihi',
	},
	{
		count: 25,
		title: 'Yıllık Tecrübe',
	},
	{
		count: 13,
		title: 'Ülkede Hizmet',
	},
]

const featuresContent = {
	subtitle: 'Özellikler',
	title: 'Otel Yönetim Sistemimizin Özellikleri',
}

const featuresCards = [
	{
		img: CheckImg,
		title: 'Anlık Rezervasyon Güncellemeleri',
		desc: 'Rezervasyonlarınızı gerçek zamanlı olarak yönetin. Kolayca iptal edin veya değiştirin.',
	},
	{
		img: NetworkImg,
		title: 'Çok Kanallı Dağıtım Modülü',
		desc: 'Oda durumunu ve fiyatları birden çok satış kanalında senkronize edin.',
	},
	{
		img: GroupImg,
		title: 'Grup Rezervasyonları',
		desc: 'Büyük gruplar için kolay rezervasyon ve yönetim imkanı.',
	},
	{
		img: WebImg,
		title: 'Web Site Modülü',
		desc: 'Ücretsiz sunduğumuz websitenizden online ödeme almaya başlayın.',
	},
	{
		img: PaymentImg,
		title: 'Dinamik Fiyatlandırma',
		desc: 'Talebe bağlı olarak otomatik fiyat ayarlama.',
	},
	{
		img: WheelImg,
		title: 'Oda Tipi ve Özellik Yönetimi',
		desc: 'Her oda tipini ayrı ayrı yönetme ve özelleştirme.',
	},
	{
		img: DiscountImg,
		title: 'Paket ve Promosyon Yönetimi',
		desc: 'Özel paketler ve promosyonlar oluşturarak satışları artırın.',
	},
	{
		img: HistoryImg,
		title: 'Müşteri Profili Yönetimi',
		desc: 'Misafirlerin tercihlerini ve geçmiş rezervasyonlarını takip edin.',
	},
	{
		img: ContactImg,
		title: 'E-posta ve SMS ile Müşteri İletişimi',
		desc: 'Özel günler ve hatırlatmalar için otomatik bildirimler gönderin.',
	},
]

const planContent = {
	subtitle: 'Paketler',
	title: 'Tüm Oteller İçin Uygun Çözümler',
}

const planImg = PlanImg

const planData = {
	title: 'Tek Plan',
	subtitle: 'Gelişmiş Profesyonel Paket',
	tag: 'Popüler',
	price: '750',
	curr: '$',
	period: 'Yıllık',
	basicFeatures: [
		'Websitesi',
		'Kanal Yönetimi',
		'Kimlik Bildirim Sistemi',
		'Online Rezervasyon Sistemi',
		'Ön Muhasebe',
		'E-Posta ve SMS Bilgilendirmesi',
		'Grup Rezervasyon',
		'E-Posta Kurulumu',
		'Online Ödeme Sistemi',
	],
	extraFeatures: ['7/24 Destek', '1 Ay Ücretsiz Sosyal Medya Danışmanlığı'],
	button: {
		title: 'Başlatın',
		url: 'https://tiksoft.com.tr/',
	},
}

const servicesContent = {
	subtitle: 'Hizmetler',
	title: 'Hızlı Güvenilir Çözümler',
}

const servicesData = [
	{
		title: 'API Hizmeti',
		description: 'Otel yönetimi yazılımınızı diğer sistemler ve uygulamalarla sorunsuz bir şekilde entegre etmenizi sağlar.',
	},
	{
		title: 'Fatura Sistemi',
		description: 'Otel hizmetleri için faturalandırma ve ödeme işlemlerini otomatikleştirir.',
	},
	{
		title: 'Geri Bildirim Sistemi',
		description: 'Müşterilerinizden geri bildirim toplamanızı ve hizmet kalitenizi sürekli iyileştirmenizi sağlar.',
	},
	{
		title: 'Müşteri Yönetimi',
		description: 'Otelinizin müşteri veritabanını yönetmek ve müşteri ilişkilerini geliştirmek için idealdir.',
	},
	{
		title: 'Rezervasyon Sistemi',
		description: 'Otel odaları için online rezervasyon yapılmasını ve yönetilmesini kolaylaştırır.',
	},
]

const servicesImg = ServicesImg

const servicesButton = {
	title: 'Diğer Hizmetler',
	url: '#iletisim',
}

const referancesContent = {
	subtitle: 'Referanslar',
	title: 'En İyilerin Tercihi: Otel Yönet',
	greenTitle: '100% Memnuniyet',
	description: [
		"Otel Yönetiminde Mükemmellik, 100'den fazla otel ve bungalov tarafından tercih edilen bir yönetim anlayışını temsil eder. Bu anlayış, misafir memnuniyetini en üst düzeyde tutmayı  edefler ve bu hedef doğrultusunda, konaklama tesislerinin her bir detayını dikkatle ele alır.",
		'Bu yönetim yaklaşımının başarısı, müşterilerimizden alınan yüksek memnuniyet oranları ile kanıtlanmıştır. Müşterilerimizin tamamı, hizmet kalitemizle ilgili pozitif geri bildirimlerde bulunmuş, bu da otel yönetimindeki mükemmelliğin sadece bir ideal olmadığını, gerçekten ulaşılabilir bir hedef olduğunu göstermiştir.',
	],
}

const referancesImg = ReferancesImg

const referancesSlider = [Ref1Img, Ref2Img, Ref3Img, Ref4Img, Ref5Img]

const contactContent = {
	subtitle: 'İletişim',
	title: 'Bize Ulaşın',
}

const contactFormImg = ContactFormImg

const contactFormData = {
	title: 'Her türlü görüş ve önerileriniz için buradayız',
	subtitle: 'Sistem ve işleyişimiz hakkında her türlü fikrinizi bizimle paylaşabilirsiniz.',
	inputs: [
		{
			label: 'İsim',
			placeholder: 'Adınızı giriniz.',
			name: 'userName',
			type: 'text',
		},
		{
			label: 'Email',
			placeholder: 'Email adresinizi giriniz.',
			name: 'userEmail',
			type: 'email',
		},
		{
			label: 'Telefon',
			placeholder: 'Telefon numaranızı giriniz.',
			name: 'userTel',
			type: 'tel',
		},
		{
			label: 'Konu',
			placeholder: 'Mesaj konusunu giriniz.',
			name: 'userSubject',
			type: 'text',
		},
	],
	textArea: {
		label: 'Mesaj',
		placeholder: 'Mesajınızı giriniz.',
		name: 'userMessage',
	},
	button: {
		title: 'Gönder',
	},
}

const footerData = {
	descriptions: ['Otel Yönet ile, sadece bir otel yönetim sistemi değil, misafirlerinize eşsiz bir deneyim sunmanıza yardımcı olacak bir ortak edinin.'],
	payments: [AmericanExpressImg, MasterCardImg, PaypalImg, VisaImg, WiseImg],
	colum2Title: 'Bölümler',
	colum3Title: 'İletişim',
	address: 'Rize Çayeli Hopa 53200 No: 93',
	tel: '05555555555',
	email: 'info@tiksoft.com.tr',
	copyrights: 'Tüm hakları saklıdır © Copyright 2024',
	facebook: 'https://facebook.com/',
	instagram: 'https://instagram.com/',
	twitter: 'https://twitter.com/',
	linkedin: 'https://linkedin.com/',
}

export {
	logoImg,
	navLinks,
	mobileMenuTitle,
	headerButton1,
	headerButton2,
	introSlogan,
	introButton,
	introImg,
	aboutImg,
	aboutContent,
	aboutStats,
	featuresContent,
	featuresCards,
	planContent,
	planImg,
	planData,
	servicesContent,
	servicesData,
	servicesImg,
	servicesButton,
	referancesContent,
	referancesImg,
	referancesSlider,
	contactContent,
	contactFormImg,
	contactFormData,
	footerData,
}
