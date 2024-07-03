<?php
namespace App\Helpers;
use GuzzleHttp\Client;
use GuzzleHttp\Cookie\FileCookieJar;
use App\Helpers\CacheClass;
use Illuminate\Support\Facades\Storage;
require_once 'simple_html_dom.php';

class NviClass
{
	public function __construct()
	{
		$this->cookieFile = Storage::disk('local')->path('/nvi/cookie/cookie_jar.json');
		$this->jar = new FileCookieJar($this->cookieFile, true);
		$guzzleOptions = [
			'base_uri' => 'https://adres.nvi.gov.tr/',
			'http_errors' => false,
			'cookies' => $this->jar,
			'decode_content' => 'gzip',
			'timeout' => 3000,
			'headers' => [
				'Accept' => '*/*',
				'Host' => 'adres.nvi.gov.tr',
				'Connection' => 'keep-alive',
				'Referer' => 'https://adres.nvi.gov.tr/',
				'Sec-Fetch-Dest' => 'empty',
				'Sec-Fetch-Mode' => 'cors',
				'Sec-Fetch-Site' => 'same-origin',
				'User-Agent' =>
					'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/99.0.4844.82 Safari/537.36',
				'Origin' => 'https://adres.nvi.gov.tr',
				'Referer' => 'https://adres.nvi.gov.tr/',
				'Accept-Language' => 'tr-TR,tr;q=0.9,en-US;q=0.8,en;q=0.7',
				'X-Requested-With' => 'XMLHttpRequest',
			],
		];
		$this->client = new Client($guzzleOptions);
		$this->__RequestVerificationToken = $this->getToken();
	}

	public function mb_ucfirst($string, $encoding = 'UTF-8')
	{
		$strlen = mb_strlen($string, $encoding);
		$firstChar = mb_substr($string, 0, 1, $encoding);
		$then = mb_substr($string, 1, $strlen - 1, $encoding);
		return $firstChar . mb_strtolower($then, $encoding);
	}

	public function cleanLabel($label): string
  {
		$label = str_replace('İ', 'i', $label);
		$label = str_replace('I', 'ı', $label);
		$label = str_replace('  ', ' ', $label);
		$label = str_replace(' /', '/', $label);
		$label = str_replace('(', '( ', $label);
		$label = str_replace(')', ' )', $label);
		$label = str_replace('( ', '(', $label);
		$label = str_replace(' )', ')', $label);
		$label = trim(str_replace('  ', ' ', $label));
		$label = $this->mb_ucfirst($label);
		return $label;
	}

	public function getToken()
	{
		$tokenCache = new CacheClass('nvi_token');
		$tokenCache->eraseExpired();
		$chr = $tokenCache->retrieve('__RequestVerificationToken');
		if ($chr == null) {
			$response = $this->client->get('Home');
			$resbody = $response->getBody();
			$html = str_get_html($resbody);
			$token = $html->find('input[name=__RequestVerificationToken]', 0)->getAttribute('value');
			$tokenCache->store('__RequestVerificationToken', $token, 43200);
			return $token;
		} else {
			return $chr;
		}
	}

	public function getProvinces()
	{
		$cache = new CacheClass('nvi_provinces');
		$cache->eraseExpired();
		$chr = $cache->retrieve('list');
		$data = [];
		if ($chr == null) {
			$response = $this->client->post('Harita/ilListesi', [
				'headers' => [
					'__RequestVerificationToken' => $this->__RequestVerificationToken,
				],
			]);
			if ($response->getStatusCode() == 200) {
				$resbody = $response->getBody()->getContents();
				$jdResbody = json_decode($resbody, true);
				if (count($jdResbody) > 0) {
					$status = true;
					foreach ($jdResbody as $key => $body) {
						$data[$key]['label'] = $body['adi'];
						$data[$key]['value'] = $body['ilKayitNo'];
					}
				} else {
					$status = false;
				}
			} else {
				$status = false;
			}
			$reData['status'] = $status;
			$reData['data'] = $data;
			$return = json_encode($reData);
			$cache->store('list', $return, 31556926);
			return $return;
		} else {
			return $chr;
		}
	}

	public function getDistricts($province_id)
	{
		$cache = new CacheClass('nvi_' . $province_id . '_districts');
		$cache->eraseExpired();
		$chr = $cache->retrieve('list');
		$data = [];
		if ($chr == null) {
			$response = $this->client->post('Harita/ilceListesi', [
				'headers' => [
					'__RequestVerificationToken' => $this->__RequestVerificationToken,
				],
				'form_params' => [
					'ilKimlikNo' => $province_id,
					'adresReCaptchaResponse' => null,
				],
			]);
			if ($response->getStatusCode() == 200) {
				$resbody = $response->getBody()->getContents();
				$jdResbody = json_decode($resbody, true);
				if (count($jdResbody) > 0) {
					$status = true;
					foreach ($jdResbody as $key => $body) {
						$data[$key]['label'] = $this->cleanLabel($body['adi']);
						$data[$key]['value'] = $body['kimlikNo'];
					}
				} else {
					$status = false;
				}
			} else {
				$status = false;
			}
			$reData['status'] = $status;
			$reData['data'] = $data;
			$return = json_encode($reData, JSON_INVALID_UTF8_SUBSTITUTE);
			$cache->store('list', $return, 15552000);
			return $return;
		} else {
			return $chr;
		}
	}

	public function getNeighborhoods($district_id)
	{
		$cache = new CacheClass('nvi_' . $district_id . '_neighborhoods');
		$cache->eraseExpired();
		$chr = $cache->retrieve('list');
		$data = [];
		if ($chr == null) {
			$response = $this->client->post('Harita/mahalleKoyBaglisiListesi', [
				'headers' => [
					'__RequestVerificationToken' => $this->__RequestVerificationToken,
				],
				'form_params' => [
					'ilceKimlikNo' => $district_id,
					'adresReCaptchaResponse' => null,
				],
			]);
			if ($response->getStatusCode() == 200) {
				$resbody = $response->getBody()->getContents();
				$jdResbody = json_decode($resbody, true);
				if (count($jdResbody) > 0) {
					$status = true;
					foreach ($jdResbody as $key => $body) {
						$component_name = $this->cleanLabel($body['bilesenAdi']);
						$data[$key]['label'] = $component_name;
						$data[$key]['value'] = $body['kimlikNo'];
					}
				} else {
					$status = false;
				}
			} else {
				$status = false;
			}
			$reData['status'] = $status;
			$reData['data'] = $data;
			$return = json_encode($reData);
			$cache->store('list', $return, 2592000);
			return $return;
		} else {
			return $chr;
		}
	}

	public function getStreets($neighborhood_independent_id)
	{
		$cache = new CacheClass('nvi_' . $neighborhood_independent_id . '_streets');
		$cache->eraseExpired();
		$chr = $cache->retrieve('list');
		$data = [];
		if ($chr == null) {
			$response = $this->client->post('Harita/yolListesi', [
				'headers' => [
					'__RequestVerificationToken' => $this->__RequestVerificationToken,
				],
				'form_params' => [
					'mahalleKoyBaglisiKimlikNo' => $neighborhood_independent_id,
					'adresReCaptchaResponse' => null,
				],
			]);
			if ($response->getStatusCode() == 200) {
				$resbody = $response->getBody()->getContents();
				$jdResbody = json_decode($resbody, true);
				if (count($jdResbody) > 0) {
					$status = true;
					foreach ($jdResbody as $key => $body) {
						switch ($body['turKod']) {
							case 1:
								$txt = 'Meydanı';
								break;
							case 2:
								$txt = 'Bulvarı.';
								break;
							case 3:
								$txt = 'Caddesi';
								break;
							case 4:
								$txt = 'Sokak';
								break;
							case 5:
								$txt = '(Küme Evler)';
								break;
							default:
								$txt = '';
								break;
						}
						$name = $this->cleanLabel($body['adi']);
						$data[$key]['label'] = $name . ' ' . $txt;
						$data[$key]['value'] = $body['kimlikNo'];
					}
				} else {
					$status = false;
				}
			} else {
				$status = false;
			}
			$reData['status'] = $status;
			$reData['data'] = $data;
			$return = json_encode($reData);
			$cache->store('list', $return, 2592000);
			return $return;
		} else {
			return $chr;
		}
	}

	public function getBuildings($neighborhood_independent_id, $street_id)
	{
		$cache = new CacheClass(
			'nvi_' . $neighborhood_independent_id . '_' . $street_id . '_buildings'
		);
		$cache->eraseExpired();
		$chr = $cache->retrieve('list');
		$data = [];
		if ($chr == null) {
			$response = $this->client->post('Harita/binaListesi', [
				'headers' => [
					'__RequestVerificationToken' => $this->__RequestVerificationToken,
				],
				'form_params' => [
					'mahalleKoyBaglisiKimlikNo' => $neighborhood_independent_id,
					'yolKimlikNo' => $yolKimlikNo,
					'adresReCaptchaResponse' => null,
				],
			]);
			if ($response->getStatusCode() == 200) {
				$resbody = $response->getBody()->getContents();
				$jdResbody = json_decode($resbody, true);
				if (count($jdResbody) > 0) {
					$status = true;
					foreach ($jdResbody as $key => $body) {
						if ($body['adi'] != null) {
							$name = $this->cleanLabel($body['adi']);
							$data[$key]['label'] = trim(
								'No:' . rtrim($body['disKapiNoFormatted'], '-') . ' ' . $name
							);
						} else {
							$data[$key]['label'] = trim('No:' . rtrim($body['disKapiNoFormatted'], '-'));
						}
						$data[$key]['value'] = $body['kimlikNo'];
					}
				} else {
					$status = false;
				}
			} else {
				$status = false;
			}
			$reData['status'] = $status;
			$reData['data'] = $data;
			$return = json_encode($reData);
			$cache->store('list', $return, 2592000);
			return $return;
		} else {
			return $chr;
		}
	}

	public function getIndependentSections($neighborhood_independent_id, $building_id)
	{
		$data = [];
		$response = $this->client->post('Harita/bagimsizBolumListesi', [
			'headers' => [
				'__RequestVerificationToken' => $this->__RequestVerificationToken,
			],
			'form_params' => [
				'mahalleKoyBaglisiKimlikNo' => $neighborhood_independent_id,
				'binaKimlikNo' => $building_id,
				'adresReCaptchaResponse' => null,
			],
		]);
		if ($response->getStatusCode() == 200) {
			$resbody = $response->getBody()->getContents();
			$jdResbody = json_decode($resbody, true);
			if (count($jdResbody) > 0) {
				$status = true;
				foreach ($jdResbody as $key => $body) {
					if ($body['katNo'] == null) {
						$output = trim('Kat: 0');
					} else {
						$output = trim('Kat:' . $body['katNo']);
					}
					if ($body['icKapiNo'] != null && $body['icKapiNo'] != '-') {
						$output .= ' Daire: ' . trim(rtrim($body['icKapiNo'], '-'));
					}
					$data[$key]['label'] = $output;
					$data[$key]['value'] = $body['adresNo'];
				}
			} else {
				$status = false;
			}
		} else {
			$status = false;
		}
		$reData['status'] = $status;
		$reData['data'] = $data;
		$return = json_encode($reData);
		return $return;
	}

	public function getFullAddress($address_code)
	{
		$data = [];
		$response = $this->client->post('Harita/AcikAdres', [
			'headers' => [
				'__RequestVerificationToken' => $this->__RequestVerificationToken,
			],
			'form_params' => [
				'bagimsizBolumKayitNo' => null,
				'bagimsizBolumAdresNo' => $address_code,
				'adresReCaptchaResponse' => null,
			],
		]);
		if ($response->getStatusCode() == 200) {
			$status = true;
			$resbody = $response->getBody()->getContents();
			$jdResbody = json_decode($resbody, true);
			if ($jdResbody['adresNo'] != null) {
				$reData = [];
				$full_address = trim($jdResbody['acikAdresModel']['acikAdresAciklama']);
				$full_address_explode = explode('/', $full_address);
				$il = end($full_address_explode);
				$full_address = $this->cleanLabel($full_address);
				$full_address = str_replace('/ ' . $this->cleanLabel($il), ' / ' . $il, $full_address);
				$data['label'] = $full_address;
				$data['value'] = $jdResbody['adresNo'];
			} else {
				$status = false;
			}
		} else {
			$status = false;
		}
		$reData['status'] = $status;
		$reData['data'] = $data;
		$return = json_encode($reData);
		return $return;
	}

	public function getTcAdresOnay($independent_section_id, $tc_id)
	{
		$response = $this->client->post('VatandasIslemleri/AdresSorgu/KisiAdresOturuyormuAra', [
			'headers' => [
				'__RequestVerificationToken' => $this->__RequestVerificationToken,
			],
			'form_params' => [
				'query' => [
					'bagimsizBolumKimlikNo' => $independent_section_id,
					'tcKimlikNo' => $tc_id,
					'reCaptchaEncodedResponse' =>
						'03AGdBq25_La0nx6LRzLeQV-9gLdN4TjZBRXaTcGzleVQ8_isL1g8cHupSFJf9mbX2qEv2s2v42C0sjl8FtPBf7dGxspBHZXKNTeddtrqceA4SMSyex_AOVWYQzPRmzeuJooetVGWy6fVruPKwTwZ_w8eG9lxF3KHzDxyfHyaM50v-3lf4UICqJacOqpyUlOn_w_X6tdRTWodm5keI7P4nHmcb5XDW68tSfr2jF6UYaOv151AgpqZQp80wuxvkEJOCG8sNJGxJpXs9JemHx1qctr25EXeH8avauUOPRUfDdAISQmndeDdmNUirXGQ7nNJ_sTd7T0954cAxEsUNQKwjij5J0vcmQpWqn_MfHZrxdm3UEyldggKyuJZp007vtbLvcL5TRcfGrQEC3F2n5YmfsKP7PqzylD9eiQ3tk_evYG4mK4VpfaTGY8FWUs3aE2BpxWWyAmsmAbNR',
				],
			],
		]);
		$resbody = $response->getBody()->getContents();
		return $resbody;
	}
}
?>
