<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\HotelChannelManagerStoreRequest;
use App\Http\Requests\StoreCMRoomRequest;
use App\Http\Requests\StoreHotelsRequest;
use App\Http\Requests\UpdateHotelsRequest;
use App\Models\BookingChannel;
use App\Models\Building;
use App\Models\CaseAndBank;
use App\Models\Citizen;
use App\Models\CMRoom;
use App\Models\District;
use App\Models\Floor;
use App\Models\Hotel;
use App\Models\Province;
use App\Models\TaxOffice;
use App\Models\Tenant;
use App\Models\TypeHasView;
use App\Models\User;
use App\Settings\HotelSettings;
use Carbon\Carbon;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Request;
use Inertia\Inertia;
use App\Helpers\ChannelManagers;
use Spatie\Permission\Models\Role;
use Spatie\LaravelSettings\Migrations\SettingsMigrator;

class HotelController extends Controller
{
    protected SettingsMigrator $migrator;

    public function __construct()
    {
        $this->migrator = app(SettingsMigrator::class);
    }
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render('Admin/Hotel/Index',[
            'filters' => Request::all('search', 'trashed'),
            'hotels' => Hotel::select([
                'id',
                'tenant_id',
                'status',
                'name',
                'register_date',
                'renew_date',
                'price',
                'renew_price',
                'title',
                'address',
                'province_id',
                'district_id',
                'location',
                'tax_office_id',
                'tax_number',
                'phone',
                'email',
            ])->orderBy('id', 'desc')
                ->filter(Request::only('search', 'trashed'))
                ->paginate(Request::get('per_page') ?? 10)
                ->withQueryString()
                ->through(function ($hotel) {
                    return [
                        ...$hotel->toArray(),
                        'province' => $hotel->province->name,
                        'district' => $hotel->district->name,
                        'tax_office' => $hotel->tax_office->tax_office,
                        'panel_url' => 'https://' . $hotel->tenant->domains->first()->domain . '/',
                        'webhook_url' => 'https://otelyonet.com/api/'.$hotel->tenant->id.'/webhook/booking',
                    ];
                }),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreHotelsRequest $request)
    {
        $data = $request->validated();
        $tenant = Tenant::create();
        $tenant->domains()->create(['domain' => $data['subdomain'] . '.otelyonet.com']);
        $tenant->run(function () {
            $role = Role::create(['name' => 'Super Admin']);
            $user = User::create(['name' => 'Admin', 'email' => 'admin@otelyonet.com', 'password' => bcrypt('admin'),]);
            $user->assignRole($role);
            $building = Building::create(['name' => 'Ana Bina', 'description' => 'Otelin Ana Binası']);
            Floor::create(['building_id' => $building->id, 'name' => 'Zemin Kat',]);

            $channels = [["name" => "Booking.com", "code" => "bookingcom"], ["name" => "HRS", "code" => "hrs"], ["name" => "Expedia", "code" => "expedia"], ["name" => "Lastminute.com", "code" => "lastminute"], ["name" => "Hotelbeds", "code" => "hotelbeds"], ["name" => "InHores.com", "code" => "inhores"], ["name" => "Touricoholidays.com", "code" => "tourico"], ["name" => "Wotif", "code" => "wotif"], ["name" => "Destinations of the World (DOTW)", "code" => "dotw"], ["name" => "JacTravel (JacobOnline)", "code" => "jactravel"], ["name" => "Keytel Global", "code" => "keytelglobal"], ["name" => "Atel-Hotel", "code" => "atelhotels"], ["name" => "Booked.net", "code" => "booked"], ["name" => "Tatilsepeti.com", "code" => "tatilsepeti"], ["name" => "Tobook", "code" => "tobook"], ["name" => "Splendia", "code" => "splendia"], ["name" => "Escapio", "code" => "escapio"], ["name" => "Prestigia", "code" => "prestigia"], ["name" => "Icastelli.net", "code" => "icastelli"], ["name" => "SunHotels", "code" => "sunhotels"], ["name" => "Adonis.com", "code" => "adonis"], ["name" => "TripAdvisor", "code" => "tripadvisor"], ["name" => "Gezinomi", "code" => "gezinomi"], ["name" => "Jolly Tours", "code" => "jollytour"], ["name" => "iCal", "code" => "ical"], ["name" => "Airbnb - iCal", "code" => "airbnb"], ["name" => "Wimdu", "code" => "wimdu"], ["name" => "FlipKey", "code" => "flipkey"], ["name" => "HomeAway", "code" => "homeaway"], ["name" => "HouseTrip", "code" => "housetrip"], ["name" => "HolidayLettings", "code" => "holidaylettings"], ["name" => "9Flats", "code" => "9flats"], ["name" => "VRBO", "code" => "vrbo"], ["name" => "Ostrovok.ru / Emerging Travel Group", "code" => "ostrovok"], ["name" => "HostelWorld", "code" => "hostelworldxml"], ["name" => "HalalBooking.com", "code" => "halalbooking"], ["name" => "Owners Direct", "code" => "ownersdirect"], ["name" => "Top Rural", "code" => "toprural"], ["name" => "WayToStay", "code" => "waytostay"], ["name" => "Homelidays", "code" => "homelidays"], ["name" => "CitiesReference", "code" => "citiesreference"], ["name" => "Abritel", "code" => "arbitel"], ["name" => "Despegar.com", "code" => "despegar"], ["name" => "Instant World Booking", "code" => "instantworldbooking"], ["name" => "Agoda", "code" => "agodaycs5"], ["name" => "Hoojoozat", "code" => "hoojoozatxml"], ["name" => "HostelsClub.com", "code" => "hostelsclubxml"], ["name" => "Odamax.com", "code" => "odamax"], ["name" => "Trip.com (Ctrip.com)", "code" => "ctrip"], ["name" => "Revato by HotelsCombined", "code" => "hotelscombined"], ["name" => "Jumia Travel", "code" => "jumia"], ["name" => "Asiatravel.com", "code" => "asiatravel"], ["name" => "ODIGEO Connect", "code" => "odigeo"], ["name" => "Tablet Hotel", "code" => "tablethotels"], ["name" => "Traveloka", "code" => "traveloka"], ["name" => "Booking247.com", "code" => "booking247com"], ["name" => "Goibibo &amp; MakeMyTrip", "code" => "goibibo"], ["name" => "HotelREZ GDS", "code" => "hotelrez"], ["name" => "Airbnb", "code" => "airbnb-api"], ["name" => "Roomiroom.com", "code" => "roomiroom"], ["name" => "Travel Destination Online (TDOnlines)", "code" => "tdonlines"], ["name" => "Mr and Mrs Smith", "code" => "mrandmrssmith"], ["name" => "HotelTonight", "code" => "hoteltonight"], ["name" => "Pegipegi", "code" => "pegipegi"], ["name" => "STglobe", "code" => "stglobe"], ["name" => "Dnata", "code" => "dnata"], ["name" => "Bedandbreakfast.eu", "code" => "bedandbreakfast"], ["name" => "Travco", "code" => "travco"], ["name" => "Pitchup.com", "code" => "pitchup"], ["name" => "Tatilbudur.com", "code" => "tatilbudur"], ["name" => "Setur", "code" => "seturapi"], ["name" => "Fidorento", "code" => "fidorento"], ["name" => "OtelFiyat.com", "code" => "otelfiyat"], ["name" => "Coral Travel", "code" => "oti"], ["name" => "Otelz.com V2", "code" => "otelzv2"], ["name" => "Finbat", "code" => "finbat"], ["name" => "Global Travel Services (GTS)", "code" => "gtsglobal"], ["name" => "Tiket V2", "code" => "tiketv2"], ["name" => "HIS Travel Turkey", "code" => "histravel"], ["name" => "Turkish Airlines Holidays", "code" => "thyholidays"], ["name" => "Delux Tur", "code" => "deluxturizm"], ["name" => "HyperGuest", "code" => "hyperguest"], ["name" => "Within Earth", "code" => "withinearth"], ["name" => "BookingAgora", "code" => "bookingagora"], ["name" => "Peak Point", "code" => "peakpoint"], ["name" => "Homaturkey", "code" => "homaturkey"], ["name" => "Touristica", "code" => "touristica"], ["name" => "Halal Holiday Check", "code" => "halalholidaycheck"], ["name" => "HPro Travel", "code" => "hprotravel"], ["name" => "Serafina", "code" => "serafina"], ["name" => "Bedsconnect", "code" => "bedsconnect"], ["name" => "Atlas Voyages", "code" => "atlasvoyages"], ["name" => "Mercan Tourism", "code" => "mercantourism"], ["name" => "Otel Fırsatı", "code" => "otelfirsati"], ["name" => "Otel Time", "code" => "oteltime"], ["name" => "World2Meet (W2M)", "code" => "world2meet"], ["name" => "CatchBeds", "code" => "catchbeds"], ["name" => "Hotperia", "code" => "hotperia"], ["name" => "Juni Travel", "code" => "junitravel"], ["name" => "Prime Travel V3", "code" => "primeV3"], ["name" => "Babylon Holiday", "code" => "babylon"], ["name" => "Price Travel", "code" => "pricetravel"], ["name" => "Abreu", "code" => "abreu"], ["name" => "Jet2Holidays", "code" => "jet2holidays"], ["name" => "Arkas", "code" => "arkas"], ["name" => "TBO.com V2", "code" => "tboV2"], ["name" => "Otelegidelim.com", "code" => "otelegidelim"], ["name" => "Antur", "code" => "antur"], ["name" => "Golden Bay", "code" => "goldenbay"], ["name" => "OCT Turizm", "code" => "octturizm"], ["name" => "Plaza Turizm", "code" => "plazaturizm"], ["name" => "TatilDorukta.com", "code" => "tatildorukta"], ["name" => "Namila Tour", "code" => "namilatour"], ["name" => "Hegoba", "code" => "hegoba"], ["name" => "Premier World Choice", "code" => "premierworldchoice"], ["name" => "Tripholi", "code" => "tripholi"], ["name" => "Caria Holidays", "code" => "cariaholidays"], ["name" => "KTI Voyages", "code" => "ktivoyages"], ["name" => "Roibos", "code" => "roibos"], ["name" => "Online", "code" => "online"], ["name" => "Web", "code" => "web"], ["name" => "Resepsiyon", "code" => "reception"]];

            BookingChannel::insert($channels);
            $ctizenList = [["name" => "TANIMSIZ", "code" => 0], ["name" => "TURKIYE", "code" => 1001], ["name" => "AFGHANISTAN", "code" => 1002], ["name" => "ALBANIA", "code" => 1003], ["name" => "ALGERIA", "code" => 1004], ["name" => "AMERICAN SAMOA", "code" => 1005], ["name" => "ANDORRA", "code" => 1006], ["name" => "ANGOLA", "code" => 1007], ["name" => "ANGUILLA", "code" => 1008], ["name" => "ANTARCTICA", "code" => 1009], ["name" => "ANTIGUA AND BARBUDA", "code" => 1010], ["name" => "ARGENTINA", "code" => 1011], ["name" => "ARMENIA", "code" => 1012], ["name" => "ARUBA", "code" => 1013], ["name" => "AUSTRALIA", "code" => 1014], ["name" => "AUSTRIA", "code" => 1015], ["name" => "AZERBAIJAN", "code" => 1016], ["name" => "BAHAMAS", "code" => 1017], ["name" => "BAHRAIN", "code" => 1018], ["name" => "BANGLADESH", "code" => 1019], ["name" => "BARBADOS", "code" => 1020], ["name" => "BELARUS", "code" => 1021], ["name" => "BELGIUM", "code" => 1022], ["name" => "BELIZE", "code" => 1023], ["name" => "BENIN", "code" => 1024], ["name" => "BERMUDA", "code" => 1025], ["name" => "BHUTAN", "code" => 1026], ["name" => "BOLIVIA", "code" => 1027], ["name" => "BOSNIA AND HERZEGOVINA", "code" => 1028], ["name" => "BOTSWANA", "code" => 1029], ["name" => "BOUVET ISLAND", "code" => 1030], ["name" => "BRAZIL", "code" => 1031], ["name" => "BRITISH INDIAN OCEAN TERRITORY", "code" => 1032], ["name" => "BRUNEI DARUSSALAM", "code" => 1033], ["name" => "BULGARIA", "code" => 1034], ["name" => "BURKINA FASO", "code" => 1035], ["name" => "BURUNDI", "code" => 1036], ["name" => "CAMBODIA", "code" => 1037], ["name" => "CAMEROON", "code" => 1038], ["name" => "CANADA", "code" => 1039], ["name" => "CAPE VERDE", "code" => 1040], ["name" => "CAYMAN ISLANDS", "code" => 1041], ["name" => "CENTRAL AFRICAN REPUBLIC", "code" => 1042], ["name" => "CHAD", "code" => 1043], ["name" => "CHILE", "code" => 1044], ["name" => "CHINA", "code" => 1045], ["name" => "CHRISTMAS ISLAND", "code" => 1046], ["name" => "COCOS KEELING ISLANDS", "code" => 1047], ["name" => "COLOMBIA", "code" => 1048], ["name" => "COMOROS", "code" => 1049], ["name" => "CONGO REPUBLIC OF", "code" => 1050], ["name" => "CONGO THE DEMOCRATIC REPUBLIC OF THE formerly Zaire", "code" => 1051], ["name" => "COOK ISLANDS", "code" => 1052], ["name" => "COSTA RICA", "code" => 1053], ["name" => "CÔTE DIVOIRE Ivory Coast", "code" => 1054], ["name" => "CROATIA Hrvatska", "code" => 1055], ["name" => "CUBA", "code" => 1056], ["name" => "CYPRUS", "code" => 1057], ["name" => "CZECH REPUBLIC", "code" => 1058], ["name" => "DENMARK", "code" => 1059], ["name" => "DJIBOUTI", "code" => 1060], ["name" => "DOMINICA", "code" => 1061], ["name" => "DOMINICAN REPUBLIC", "code" => 1062], ["name" => "ECUADOR", "code" => 1063], ["name" => "EGYPT", "code" => 1064], ["name" => "EL SALVADOR", "code" => 1065], ["name" => "EQUATORIAL GUINEA", "code" => 1066], ["name" => "ERITREA", "code" => 1067], ["name" => "ESTONIA", "code" => 1068], ["name" => "ETHIOPIA", "code" => 1069], ["name" => "FAEROE ISLANDS", "code" => 1070], ["name" => "FALKLAND ISLANDS MALVINAS", "code" => 1071], ["name" => "FIJI", "code" => 1072], ["name" => "FINLAND", "code" => 1073], ["name" => "FRANCE", "code" => 1074], ["name" => "FRENCH GUIANA", "code" => 1075], ["name" => "FRENCH POLYNESIA", "code" => 1076], ["name" => "FRENCH SOUTHERN TERRITORIES", "code" => 1077], ["name" => "GABON", "code" => 1078], ["name" => "GAMBIA", "code" => 1079], ["name" => "GEORGIA", "code" => 1080], ["name" => "GERMANY", "code" => 1081], ["name" => "GHANA", "code" => 1082], ["name" => "GIBRALTAR", "code" => 1083], ["name" => "GREECE", "code" => 1084], ["name" => "GREENLAND", "code" => 1085], ["name" => "GRENADA", "code" => 1086], ["name" => "GUADELOUPE", "code" => 1087], ["name" => "GUAM", "code" => 1088], ["name" => "GUATEMALA", "code" => 1089], ["name" => "GUERNSEY", "code" => 1090], ["name" => "GUINEA", "code" => 1091], ["name" => "GUINEA BISSAU", "code" => 1092], ["name" => "GUYANA", "code" => 1093], ["name" => "HAITI", "code" => 1094], ["name" => "HEARD ISLAND AND MCDONALD ISLANDS", "code" => 1095], ["name" => "HONDURAS", "code" => 1096], ["name" => "HONG KONG", "code" => 1097], ["name" => "HUNGARY", "code" => 1098], ["name" => "ICELAND", "code" => 1099], ["name" => "INDIA", "code" => 1100], ["name" => "INDONESIA", "code" => 1101], ["name" => "IRAN", "code" => 1102], ["name" => "IRAQ", "code" => 1103], ["name" => "IRELAND", "code" => 1104], ["name" => "ISRAEL", "code" => 1105], ["name" => "ITALY", "code" => 1106], ["name" => "JAMAICA", "code" => 1107], ["name" => "JAPAN", "code" => 1108], ["name" => "JERSEY", "code" => 1109], ["name" => "JORDAN", "code" => 1110], ["name" => "KAZAKHSTAN", "code" => 1111], ["name" => "KENYA", "code" => 1112], ["name" => "KIRIBATI", "code" => 1113], ["name" => "NORTH KOREA", "code" => 1114], ["name" => "SOUTH KOREA", "code" => 1115], ["name" => "KUWAIT", "code" => 1116], ["name" => "KUZEY KIBRIS TURK CUMHURIYETI", "code" => 1117], ["name" => "KYRGYZSTAN", "code" => 1118], ["name" => "LAO PEOPLES DEMOCRATIC REPUBLIC", "code" => 1119], ["name" => "LATVIA", "code" => 1120], ["name" => "LEBANON", "code" => 1121], ["name" => "LESOTHO", "code" => 1122], ["name" => "LIBERIA", "code" => 1123], ["name" => "LIBYA", "code" => 1124], ["name" => "LIECHTENSTEIN", "code" => 1125], ["name" => "LITHUANIA", "code" => 1126], ["name" => "LUXEMBOURG", "code" => 1127], ["name" => "MACAO", "code" => 1128], ["name" => "MACEDONIA", "code" => 1129], ["name" => "MADAGASCAR", "code" => 1130], ["name" => "MALAWI", "code" => 1131], ["name" => "MALAYSIA", "code" => 1132], ["name" => "MALDIVES", "code" => 1133], ["name" => "MALI", "code" => 1134], ["name" => "MALTA", "code" => 1135], ["name" => "MARSHALL ISLANDS", "code" => 1136], ["name" => "MARTINIQUE", "code" => 1137], ["name" => "MAURITANIA", "code" => 1138], ["name" => "MAURITIUS", "code" => 1139], ["name" => "MAYOTTE", "code" => 1140], ["name" => "MEXICO", "code" => 1141], ["name" => "MICRONESIA", "code" => 1142], ["name" => "MOLDOVA", "code" => 1143], ["name" => "MONACO", "code" => 1144], ["name" => "MONGOLIA", "code" => 1145], ["name" => "MONTSERRAT", "code" => 1146], ["name" => "MOROCCO", "code" => 1147], ["name" => "MOZAMBIQUE", "code" => 1148], ["name" => "MYANMAR", "code" => 1149], ["name" => "NAMIBIA", "code" => 1150], ["name" => "NAURU", "code" => 1151], ["name" => "NEPAL", "code" => 1152], ["name" => "NETHERLANDS", "code" => 1153], ["name" => "NETHERLANDS ANTILLES", "code" => 1154], ["name" => "NEW CALEDONIA", "code" => 1155], ["name" => "NEW ZEALAND", "code" => 1156], ["name" => "NICARAGUA", "code" => 1157], ["name" => "NIGER", "code" => 1158], ["name" => "NIGERIA", "code" => 1159], ["name" => "NIUE", "code" => 1160], ["name" => "NORFOLK ISLAND", "code" => 1161], ["name" => "NORTHERN MARIANA ISLANDS", "code" => 1162], ["name" => "NORWAY", "code" => 1163], ["name" => "OMAN", "code" => 1164], ["name" => "PAKISTAN", "code" => 1165], ["name" => "PALAU", "code" => 1166], ["name" => "PALESTINIAN TERRITORIES", "code" => 1167], ["name" => "PANAMA", "code" => 1168], ["name" => "PAPUA NEW GUINEA", "code" => 1169], ["name" => "PARAGUAY", "code" => 1170], ["name" => "PERU", "code" => 1171], ["name" => "PHILIPPINES", "code" => 1172], ["name" => "PITCAIRN", "code" => 1173], ["name" => "POLAND", "code" => 1174], ["name" => "PORTUGAL", "code" => 1175], ["name" => "PUERTO RICO", "code" => 1176], ["name" => "QATAR", "code" => 1177], ["name" => "REPUBLIC OF KOSOVO", "code" => 1178], ["name" => "RÉUNION", "code" => 1179], ["name" => "ROMANIA", "code" => 1180], ["name" => "RUSSIAN FEDERATION", "code" => 1181], ["name" => "RWANDA", "code" => 1182], ["name" => "SAINT HELENA", "code" => 1183], ["name" => "SAINT KITTS AND NEVIS", "code" => 1184], ["name" => "SAINT LUCIA", "code" => 1185], ["name" => "SAINT PIERRE AND MIQUELON", "code" => 1186], ["name" => "SAINT VINCENT AND THE GRENADINES", "code" => 1187], ["name" => "SAMOA", "code" => 1188], ["name" => "SAN MARINO", "code" => 1189], ["name" => "SAO TOME AND PRINCIPE", "code" => 1190], ["name" => "SAUDI ARABIA", "code" => 1191], ["name" => "SENEGAL", "code" => 1192], ["name" => "SERBIA AND MONTENEGRO", "code" => 1193], ["name" => "SEYCHELLES", "code" => 1194], ["name" => "SIERRA LEONE", "code" => 1195], ["name" => "SINGAPORE", "code" => 1196], ["name" => "SLOVAKIA", "code" => 1197], ["name" => "SLOVENIA", "code" => 1198], ["name" => "SOLOMON ISLANDS", "code" => 1199], ["name" => "SOMALIA", "code" => 1200], ["name" => "SOUTH AFRICA", "code" => 1201], ["name" => "SOUTH GEORGIA AND THE SOUTH SANDWICH ISLANDS", "code" => 1202], ["name" => "SPAIN", "code" => 1203], ["name" => "SRI LANKA", "code" => 1204], ["name" => "SUDAN", "code" => 1205], ["name" => "SURINAME", "code" => 1206], ["name" => "SVALBARD AND JAN MAYEN", "code" => 1207], ["name" => "SWAZILAND", "code" => 1208], ["name" => "SWEDEN", "code" => 1209], ["name" => "SWITZERLAND", "code" => 1210], ["name" => "SYRIAN ARAB REPUBLIC", "code" => 1211], ["name" => "TAIWAN", "code" => 1212], ["name" => "TAJIKISTAN", "code" => 1213], ["name" => "TANZANIA", "code" => 1214], ["name" => "THAILAND", "code" => 1215], ["name" => "TIMOR LESTE", "code" => 1216], ["name" => "TOGO", "code" => 1217], ["name" => "TOKELAU", "code" => 1218], ["name" => "TONGA", "code" => 1219], ["name" => "TRINIDAD AND TOBAGO", "code" => 1220], ["name" => "TUNISIA", "code" => 1221], ["name" => "TURKMENISTAN", "code" => 1222], ["name" => "TURKS AND CAICOS ISLANDS", "code" => 1223], ["name" => "TUVALU", "code" => 1224], ["name" => "UGANDA", "code" => 1225], ["name" => "UKRAINE", "code" => 1226], ["name" => "UNITED ARAB EMIRATES", "code" => 1227], ["name" => "UNITED KINGDOM", "code" => 1228], ["name" => "UNITED STATES", "code" => 1229], ["name" => "UNITED STATES MINOR OUTLYING ISLANDS", "code" => 1230], ["name" => "URUGUAY", "code" => 1231], ["name" => "UZBEKISTAN", "code" => 1232], ["name" => "VANUATU", "code" => 1233], ["name" => "VATICAN CITY", "code" => 1234], ["name" => "VENEZUELA", "code" => 1235], ["name" => "VIET NAM", "code" => 1236], ["name" => "VIRGIN ISLANDS BRITISH", "code" => 1237], ["name" => "VIRGIN ISLANDS US", "code" => 1238], ["name" => "WALLIS AND FUTUNA", "code" => 1239], ["name" => "WESTERN SAHARA", "code" => 1240], ["name" => "YEMEN", "code" => 1241], ["name" => "ZAMBIA", "code" => 1242], ["name" => "ZIMBABWE", "code" => 1243]];

            Citizen::insert($ctizenList);
            $pricingPolicy = ['label' => 'Oda Satış Politikası', 'description' => 'Oda şatış politikası odanın kişi bazlı mı yoksa ünite bazlı mı fiyatlandırılacağını belirler. Kişi bazlı fiyatlandırmada oda fiyatı kişi sayısına göre değişirken, ünite bazlı fiyatlandırmada oda fiyatı sabittir.', 'name' => 'pricing_policy', 'type' => 'select', //text, number, select, boolean
                'options' => [['label' => 'Kişi Bazlı Fiyatlandırma', 'value' => 'person_based',], ['label' => 'Ünite Bazlı Fiyatlandırma', 'value' => 'unit_based',]], 'value' => 'person_based',];

            $babyAgeLimit = ['label' => 'Bebek yaş sınırı', 'description' => 'Bebek yaş sınırı bebekler bebek yaş sınırını belirler. Bu değerden küçük olan yaştaki çocuklar bebek sayılacaktır. Örn: 2 yazıldığında 0-2 yaş arası bebek sayılacaktır. 2 yaş ve üstü çocuk sayılacaktır.', 'name' => 'baby_age_limit', 'type' => 'number', //text, number, select, boolean
                'options' => [], 'value' => 2,];

            $childAgeLimit = ['label' => 'Çocuk Yaş Sınırı', 'description' => 'Çocuk yaş sınırı çocuklar için yaş sınırını belirler. Bu değerden küçük olan yaştaki çocuklar çocuk sayılacaktır. Örn: 12 yazıldığında bebek yaşı üst limiti bir yukarıdaki değerde 2 olarak belirtildiyse 2-12 yaş arası çocuk sayılacaktır. 12 yaş ve üstü yetişkin sayılacaktır.', 'name' => 'child_age_limit', 'type' => 'number', //text, number, select, boolean
                'options' => [], 'value' => 12,];

            $freeChildOrBabyMaxAge = ['label' => 'Ücretisiz Çocuk Yaş Sınırı', 'description' => 'Otelinizde ücretsiz konaklama hakkı olan çocuk yaşı sınırını belirler. Bu değerden küçük olan yaştaki çocuklar ücretsiz konaklama hakkına sahip olacaktır. Örn: 4 yazıldığında 0-4 yaş arası çocuklar ücretsiz konaklama hakkına sahip olacaktır. 4 yaş ve üstü çocuklar için ücret alınacaktır.', 'name' => 'free_child_or_baby_max_age', 'type' => 'number', //text, number, select, boolean
                'options' => [], 'value' => 4,];

            $freeChildOrBabyMaxNumber = ['label' => 'Ücretsiz Çocuk veya Bebek Max Sayısı', 'description' => 'Otelinizde ücretsiz konaklama hakkı olan çocuk veya bebek sayısını belirler. Bu değerden küçük olan sayıdaki çocuklar ücretsiz konaklama hakkına sahip olacaktır. Örn: 2 yazıldığında 0-2 yaş arası 2 çocuk ücretsiz konaklama hakkına sahip olacaktır. 2 çocuktan fazlası için ücret alınacaktır.', 'name' => 'free_child_or_baby_max_number', 'type' => 'number', //text, number, select, boolean
                'options' => [], 'value' => 2,];

            $taxRate = ['label' => 'Konaklama Vergi Oranı', 'description' => 'Otelinizde uygulanan konaklama vergi oranını belirler. Örn: %20 yazıldığında konaklama fiyatına %20 oranında vergi eklenir.', 'name' => 'tax_rate', 'type' => 'number', //text, number, select, boolean
                'options' => [], 'value' => 20,];

            $currencies = [['label' => 'Türk Lirası', 'value' => 'TRY'], ['label' => 'Amerikan Doları', 'value' => 'USD'], ['label' => 'Euro', 'value' => 'EUR'], ['label' => 'İngiliz Sterlini', 'value' => 'GBP'], ['label' => 'Suudi Arabistan Riyali', 'value' => 'SAR'], ['label' => 'Avustralya Doları', 'value' => 'AUD'], ['label' => 'İsveç Frangı', 'value' => 'CHF'], ['label' => 'Kanada Doları', 'value' => 'CAD'], ['label' => 'Kuveyt Dinarı', 'value' => 'KWD'], ['label' => 'Japon Yeni', 'value' => 'JPY'], ['label' => 'Danimarka Kronu', 'value' => 'DKK'], ['label' => 'İsveç Kronu', 'value' => 'SEK'], ['label' => 'Norveç Kronu', 'value' => 'NOK'],];

            //Selectbox olmalı...
            $currency = ['label' => 'Para birimi (Ülke Para Birimi)', 'description' => 'Otelinizin para birimini belirler. Örn: TL, USD, EUR gibi...', 'name' => 'currency', 'type' => 'select', //text, number, select, boolean
                'options' => $currencies, 'value' => 'TRY',];
            //Selectbox olmalı...
            $pricingCurrency = ['label' => 'Fiyatlandırma Para Birimi', 'description' => 'Otelinizin fiyatlandırma para birimini belirler. Örn: TL, USD, EUR gibi...', 'name' => 'pricing_currency', 'type' => 'select', //text, number, select, boolean
                'options' => $currencies, 'value' => 'TRY',];
            //Selectbox olmalı...
            $checkInTimePolicy = ['label' => 'Check in Saat Politikası', 'description' => 'Otelinizde check in saat politikasını belirler. Örn: 14:00 yazıldığında check in saati 14:00 olarak belirlenir. Check in saati politikası oteldeki check in saatini belirler.', 'name' => 'check_in_time_policy', 'type' => 'select', //text, number, select, boolean
                'options' => [['label' => '00:30', 'value' => '00:30'], ['label' => '11:00', 'value' => '11:00'], ['label' => '11:30', 'value' => '11:30'], ['label' => '12:00', 'value' => '12:00'], ['label' => '12:30', 'value' => '12:30'], ['label' => '13:00', 'value' => '13:00'], ['label' => '13:30', 'value' => '13:30'], ['label' => '14:00', 'value' => '14:00'], ['label' => '14:30', 'value' => '14:30'], ['label' => '15:00', 'value' => '15:00'], ['label' => '15:30', 'value' => '15:30'], ['label' => '16:00', 'value' => '16:00'],], 'value' => '14:00',];

            $checkOutTimePolicy = ['label' => 'Check out Saat Politikası', 'description' => 'Otelinizde check out saat politikasını belirler. Örn: 11:00 yazıldığında check out saati 11:00 olarak belirlenir. Check out saati politikası oteldeki check out saatini belirler.', 'name' => 'check_out_time_policy', 'type' => 'select', //text, number, select, boolean
                'options' => [['label' => '09:00', 'value' => '09:00'], ['label' => '09:30', 'value' => '09:30'], ['label' => '10:00', 'value' => '10:00'], ['label' => '10:30', 'value' => '10:30'], ['label' => '11:00', 'value' => '11:00'], ['label' => '11:30', 'value' => '11:30'], ['label' => '12:00', 'value' => '12:00'], ['label' => '12:30', 'value' => '12:30'], ['label' => '13:00', 'value' => '13:00'], ['label' => '13:30', 'value' => '13:30'], ['label' => '14:00', 'value' => '14:00'],], 'value' => '11:00',];

            $accommodationTypes = ['label' => 'Konaklama Türü', 'description' => 'Otelinizdeki konaklama türünü belirler. Örn: Sadece Oda, Oda Kahvaltı, Yarım Pansiyon, Tam Pansiyon, Herşey Dahil, Ultra Herşey Dahil gibi...', 'name' => 'accommodation_type', 'type' => 'select', 'options' => [['label' => 'Sadece Oda', 'value' => 'only_room',], ['label' => 'Oda Kahvaltı', 'value' => 'room_breakfast',], ['label' => 'Yarım Pansiyon', 'value' => 'half_board',], ['label' => 'Tam Pansiyon', 'value' => 'full_board',], ['label' => 'Herşey Dahil', 'value' => 'all_inclusive',], ['label' => 'Ultra Herşey Dahil', 'value' => 'ultra_all_inclusive',],], 'value' => 'only_room',];

            $this->migrator->add('pricing_policy.pricing_policy', $pricingPolicy); //17
            $this->migrator->add('pricing_policy.baby_age_limit', $babyAgeLimit); //17
            $this->migrator->add('pricing_policy.child_age_limit', $childAgeLimit); //17
            $this->migrator->add('pricing_policy.free_child_or_baby_max_age', $freeChildOrBabyMaxAge); //4
            $this->migrator->add('pricing_policy.free_child_or_baby_max_number', $freeChildOrBabyMaxNumber);
            $this->migrator->add('pricing_policy.tax_rate', $taxRate);
            $this->migrator->add('pricing_policy.currency', $currency);
            $this->migrator->add('pricing_policy.pricing_currency', $pricingCurrency); //person_based -  unit_based
            $this->migrator->add('pricing_policy.check_in_time_policy', $checkInTimePolicy);
            $this->migrator->add('pricing_policy.check_out_time_policy', $checkOutTimePolicy);
            $this->migrator->add('pricing_policy.accommodation_type', $accommodationTypes);
            $channelManagers = [['label' => 'HotelRunner', 'value' => 'hotelrunner']];
            //Selectbox olmalı...
            $channelManager = ['label' => 'Kanal Yöneticisi', 'description' => 'Otelin kullanacağı kanal yöneticisini belirler Örn: HotelRunner, SiteMinder, Reseliva, Cloudbeds gibi...', 'name' => 'channel_manager', 'type' => 'select', //text, number, select, boolean
                'options' => $channelManagers, 'value' => 'closed'];
            //Selectbox olmalı...

            $this->migrator->add('hotel.channel_manager', $channelManager);
            $this->migrator->add('hotel.api_settings', []);
            Artisan::call( 'permission:generate-permissions');
            CaseAndBank::create(['name' => 'Nakit Kasa', 'currency' => 'TRY', 'type' => 'case']);
            CaseAndBank::create(['name' => 'POS Kasa', 'currency' => 'TRY', 'type' => 'bank']);
            CaseAndBank::create(['name' => 'Havale Kasa', 'currency' => 'TRY', 'type' => 'bank']);
            CaseAndBank::create(['name' => 'Online Kasa', 'currency' => 'TRY', 'type' => 'case']);
        });
        $data['status'] = 'active';
        $data['register_date'] = Carbon::parse($data['register_date'])->format('Y-m-d');
        $data['renew_date'] = Carbon::parse($data['renew_date'])->format('Y-m-d');
        $tenant->hotel()->create([
            'status' => $data['status'],
            'name' => $data['name'],
            'register_date' => $data['register_date'],
            'renew_date' => $data['renew_date'],
            'price' => $data['price'],
            'renew_price' => $data['renew_price'],
            'title' => $data['title'],
            'address' => $data['address'],
            'province_id' => $data['province_id'],
            'district_id' => $data['district_id'],
            'tax_office_id' => $data['tax_office_id'],
            'tax_number' => $data['tax_number'],
            'phone' => $data['phone'],
            'email' => $data['email'],
        ]);
        return redirect()->route('admin.hotels.index')->with('success', 'Otel oluşturuldu.');
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Admin/Hotel/Create', [
            'provinces' => Province::all(['id', 'name']),
            'districts' => District::all(['id', 'province_id', 'name']),
            'tax_offices' => TaxOffice::all(['id', 'province_id', 'tax_office']),
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(Hotel $hotel)
    {
        $tenant = $hotel->tenant;
        $settings = null;
        $typeHasViews = null;
        $tenant->run(function () use (&$settings, &$typeHasViews) {
            $settings = new HotelSettings();
            $typeHasViews = TypeHasView::all();
        });
        return Inertia::render('Admin/Hotel/Show',[
            'hotel' => [
                ...$hotel->toArray(),
                'province' => $hotel->province->name,
                'district' => $hotel->district->name,
                'tax_office' => $hotel->tax_office->tax_office,
                'panel_url' => 'https://' . $hotel->tenant->domains->first()->domain . '/',
                'webhook_url' => 'https://otelyonet.com/api/'.$hotel->tenant->id.'/webhook/booking',
            ],
            'tenant' => [
                ...$hotel->tenant->toArray(),
                'domains' => $hotel->tenant->domains->pluck('domain'),
                'settings' => $settings->toArray(),
                'type_has_views' => $typeHasViews->map(function ($typeHasView) {
                    return [
                        'value' => $typeHasView->id,
                        'label' => $typeHasView->type->name . ' '. $typeHasView->view->name,
                        'count' => $typeHasView->rooms->count(),
                    ];
                })->toArray(),
            ],
        ]);
    }

    public function channel_manager(Hotel $hotel, HotelChannelManagerStoreRequest $request)
    {
        $tenant = $hotel->tenant;
        $request->validated();
        $tenant->run(function () use ($request) {
            $settings = new HotelSettings();
            $settingsData = $settings->toArray();
            if($request->channel_manager !== 'closed' && $request->channel_manager !==
                $settingsData['channel_manager']['value']) {
                $settingsData['channel_manager']['value'] = $request->channel_manager;
                $settingsData['api_settings']['token'] = $request->api_token;
                $settingsData['api_settings']['hr_id'] = $request->api_hr_id;
            } else {
                if($request->channel_manager === 'closed') {
                    $settingsData['channel_manager']['value'] = $request->channel_manager;
                    $settingsData['api_settings'] = [];
                } else {
                    $settingsData['api_settings']['token'] = $request->api_token;
                    $settingsData['api_settings']['hr_id'] = $request->api_hr_id;
                }
            }
            $settings->fill($settingsData);
            $settings->save();
        });
        if($request->channel_manager === 'closed') {
            return [
                'status' => 'success',
                'message' => 'Kanal yöneticisi kapatıldı.',
                'rooms' => [],
            ];
        } else {
            if($request->api_token !== null && $request->api_hr_id !== null) {
                $channelManagers = new ChannelManagers($request->channel_manager, ['token' => $request->api_token, 'hr_id' => $request->api_hr_id]);
                return [
                    'status' => 'success',
                    'message' => 'Kanal yöneticisi başarıyla güncellendi.',
                    'rooms' => $channelManagers->getRooms()->rooms,
                ];
            } else {
                return [
                    'status' => 'error',
                    'message' => 'Kanal yöneticisi güncellenirken bir hata oluştu.',
                    'rooms' => [],
                ];
            }
        }
    }

    public function CmRoomsStore(Hotel $hotel, StoreCMRoomRequest $request)
    {
        $request->validated();
        $tenant = $hotel->tenant;
        $request->cm_room_code = str_replace('HR:', '', $request->cm_room_code);
        $tenant->run(function () use ($request) {
            $cmRoom = CMRoom::where('type_has_view_id', $request->type_has_view_id)
                ->orWhere('room_code', $request->cm_room_code)
                ->first();
            if ($cmRoom) {
                $cmRoom->update([
                    'type_has_view_id' => $request->type_has_view_id,
                    'room_code' => $request->cm_room_code,
                    'stock' => $request->stock,
                ]);
            } else {
                CMRoom::create([
                    'type_has_view_id' => $request->type_has_view_id,
                    'room_code' => $request->cm_room_code,
                    'stock' => $request->stock,
                ]);
            }
        });
        return redirect()->route('admin.hotels.show', $hotel->id)->with('success', 'Oda ataması eklendi.');
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Hotel $hotels)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateHotelsRequest $request, Hotel $hotels)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Hotel $hotels)
    {
        //
    }
}
