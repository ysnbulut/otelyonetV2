<?php

namespace App\Services;

use SoapClient;
use App\Exceptions\SoapException;

class KimlikBildirimService
{
    protected $wsdl = 'https://vatandas.jandarma.gov.tr/KBS_Tesis_Servis/SrvShsYtkTml.svc?wsdl';

    protected SoapClient $client;
    protected $TSS_KOD, $KLN_TC, $KLN_SIFRE;

    /**
     * @throws SoapException
     */
    public function __construct($TSS_KOD, $KLN_TC, $KLN_SIFRE)
    {
        libxml_use_internal_errors(true);

        $this->client = new SoapClient($this->wsdl, [
            'trace' => true,
            'exceptions' => true,
            'cache_wsdl' => WSDL_CACHE_NONE,
            'soap_version' => SOAP_1_2,
            'encoding' => 'UTF-8',
        ]);

        $this->TSS_KOD = $TSS_KOD;
        $this->KLN_TC = $KLN_TC;
        $this->KLN_SIFRE = $KLN_SIFRE;
    }

    /**
     * Perform SOAP request with given template and action.
     *
     * @param string $templateContent
     * @param string $action
     * @param array $parameters
     * @return \SimpleXMLElement
     * @throws SoapException
     */
    protected function performSoapRequest(string $templateContent, string $action, array $parameters = []): \SimpleXMLElement
    {
        try {
            $response = $this->client->__doRequest($this->fillSoapTemplate($templateContent, $parameters), $this->wsdl, $action, SOAP_1_1);

            if ($response === false) {
                throw new SoapException('SOAP request failed. Last request: ' . $this->client->__getLastRequest());
            }

            $responseXml = simplexml_load_string(preg_replace("/(<\/?)(\w+):([^>]*>)/", "$1$2$3", $response))->xpath('//sBody')[0];

            if ($responseXml === false) {
                $error = implode(", ", libxml_get_errors());
                throw new SoapException('Failed to parse SOAP response XML. Error: ' . $error . '. Last response: ' . $this->client->__getLastResponse());
            }

            return $responseXml;
        } catch (\SoapFault $e) {
            throw new SoapException($e->getMessage());
        }
    }

    /**
     * Make a SOAP request to retrieve parameters.
     *
     * @param array $parametreBilgi
     * @return \SimpleXMLElement
     * @throws SoapException
     */
    public function parametreListele(array $parametreBilgi)
    {
        $templateContent = $this->getSoapTemplate('parametreler.xml');

        $requiredFields = ['KULLANICI_TC', 'TSS_KOD', 'SIFRE', 'PARAMETRE'];

        $parametreBilgi['KULLANICI_TC'] = $this->KLN_TC;
        $parametreBilgi['TSS_KOD'] = $this->TSS_KOD;
        $parametreBilgi['SIFRE'] = $this->KLN_SIFRE;

        $this->validateRequiredFields($requiredFields, $parametreBilgi);

        return json_decode(json_encode($this->performSoapRequest($templateContent, 'http://tempuri.org/ISrvShsYtkTml/ParametreListele', $parametreBilgi)->ParametreListeleResponse->ParametreListeleResult->aItems), true);
    }

    /**
     * Make a SOAP request to register customer information.
     *
     * @param array $musteriBilgi
     * @return \SimpleXMLElement
     * @throws SoapException
     */
    public function musteriKimlikNoGiris(array $musteriBilgi)
    {
        $templateContent = $this->getSoapTemplate('musteri-kimlik-no-giris.xml');

        $requiredFields = ['KULLANICI_TC', 'TSS_KOD', 'SIFRE', 'GRSTRH', 'KIMLIKNO', 'KULLANIMSEKLI', 'ODANO', 'PLKNO', 'ADI', 'SOYADI', 'TELNO', 'ULKKOD'];

        $musteriBilgi['KULLANICI_TC'] = $this->KLN_TC;
        $musteriBilgi['TSS_KOD'] = $this->TSS_KOD;
        $musteriBilgi['SIFRE'] = $this->KLN_SIFRE;

        $this->validateRequiredFields($requiredFields, $musteriBilgi);

        return json_decode(json_encode($this->performSoapRequest($templateContent, 'http://tempuri.org/ISrvShsYtkTml/MusteriKimlikNoGiris', $musteriBilgi)->MusteriKimlikNoGirisResponse->MusteriKimlikNoGirisResult->asonuc), true);
    }

    /**
     * Make a SOAP request to perform customer exit.
     *
     * @param array $musteriBilgi
     * @return array
     * @throws SoapException
     */
    public function musteriKimlikNoCikis(array $musteriBilgi): array
    {
        $templateContent = $this->getSoapTemplate('musteri-kimlik-no-cikis.xml');

        $requiredFields = ['KULLANICI_TC', 'TSS_KOD', 'SIFRE', 'CKSTRH', 'KIMLIKNO'];

        $musteriBilgi['KULLANICI_TC'] = $this->KLN_TC;
        $musteriBilgi['TSS_KOD'] = $this->TSS_KOD;
        $musteriBilgi['SIFRE'] = $this->KLN_SIFRE;

        if (isset($musteriBilgi['CKSTRH'])) {
            $date = new \DateTime($musteriBilgi['CKSTRH']);
            $musteriBilgi['CKSTRH'] = $date->format('Y-m-d\TH:i:s');
        }

        $this->validateRequiredFields($requiredFields, $musteriBilgi);

        return json_decode(json_encode($this->performSoapRequest($templateContent, 'http://tempuri.org/ISrvShsYtkTml/MusteriKimlikNoCikis', $musteriBilgi)->MusteriKimlikNoCikisResponse->MusteriKimlikNoCikisResult), true);
    }

    /**
     * Register foreign customer information.
     *
     * @param array $musteriBilgi
     * @return array
     * @throws SoapException
     */
    public function musteriYabanciGiris(array $musteriBilgi)
    {
        $templateContent = $this->getSoapTemplate('yabanci-musteri-giris.xml');

        $requiredFields = ['KULLANICI_TC', 'TSS_KOD', 'SIFRE', 'ADI', 'SOYADI', 'ANAADI', 'BABAADI', 'BELGENO', 'CINSIYET', 'DOGUMTARIHI', 'GRSTRH', 'MEDENIHAL', 'ODANO', 'PLKNO', 'TELNO', 'ULKKOD'];

        $musteriBilgi['KULLANICI_TC'] = $this->KLN_TC;
        $musteriBilgi['TSS_KOD'] = $this->TSS_KOD;
        $musteriBilgi['SIFRE'] = $this->KLN_SIFRE;

        $this->validateRequiredFields($requiredFields, $musteriBilgi);

        return json_decode(json_encode($this->performSoapRequest($templateContent, 'http://tempuri.org/ISrvShsYtkTml/MusteriYabanciGiris', $musteriBilgi)->MusteriYabanciGirisResponse->MusteriYabanciGirisResult->asonuc), true);
    }

    public function musteriYabanciCikis(array $musteriBilgi)
    {
        $templateContent = $this->getSoapTemplate('yabanci-musteri-cikis.xml');

        $requiredFields = ['KULLANICI_TC', 'TSS_KOD', 'SIFRE', 'CKSTRH', 'BELGENO'];

        $musteriBilgi['KULLANICI_TC'] = $this->KLN_TC;
        $musteriBilgi['TSS_KOD'] = $this->TSS_KOD;
        $musteriBilgi['SIFRE'] = $this->KLN_SIFRE;

        $this->validateRequiredFields($requiredFields, $musteriBilgi);

        return json_decode(json_encode($this->performSoapRequest($templateContent, 'http://tempuri.org/ISrvShsYtkTml/MusteriYabanciCikis', $musteriBilgi)->MusteriYabanciCikisResponse->MusteriYabanciCikisResult), true);

    }

    public function musteriYabanciListele(): array
    {
        $templateContent = $this->getSoapTemplate('musteri-yabanci-listele.xml');

        $parameters = [
            'KULLANICI_TC' => $this->KLN_TC,
            'TSS_KOD' => $this->TSS_KOD,
            'SIFRE' => $this->KLN_SIFRE,
        ];

        return json_decode(json_encode($this->performSoapRequest($templateContent, 'http://tempuri.org/ISrvShsYtkTml/MusteriYabanciListele', $parameters)->MusteriYabanciListeleResponse->MusteriYabanciListeleResult->amItems), true);
    }

    public function musteriKimlikNoListele(): array
    {
        $templateContent = $this->getSoapTemplate('musteri-kimlikno-listele.xml');

        $parameters = [
            'KULLANICI_TC' => $this->KLN_TC,
            'TSS_KOD' => $this->TSS_KOD,
            'SIFRE' => $this->KLN_SIFRE,
        ];

        return json_decode(json_encode($this->performSoapRequest($templateContent, 'http://tempuri.org/ISrvShsYtkTml/MusteriKimlikNoListele', $parameters)->MusteriKimlikNoListeleResponse->MusteriKimlikNoListeleResult->amItems), true);
    }

    /**
     * Validate required fields in the input data.
     *
     * @param array $requiredFields
     * @param array $data
     * @throws SoapException
     */
    protected function validateRequiredFields(array $requiredFields, array $data): void
    {
        $missingFields = array_diff($requiredFields, array_keys($data));
        if (count($missingFields) > 0) {
            throw new SoapException('Missing required fields: ' . implode(', ', $missingFields));
        }
    }

    /**
     * Get SOAP template content from file.
     *
     * @param string $templateFileName
     * @return string
     * @throws SoapException
     */
    protected function getSoapTemplate($templateFileName)
    {
        $templatePath = resource_path("views/soap/$templateFileName");
        $templateContent = file_get_contents($templatePath);

        if ($templateContent === false) {
            throw new SoapException("SOAP template file '$templateFileName' not found or cannot be read.");
        }

        return $templateContent;
    }

    /**
     * Fill SOAP template with provided parameters.
     *
     * @param string $templateContent
     * @param array $parameters
     * @return string
     */
    protected function fillSoapTemplate($templateContent, array $parameters)
    {
        foreach ($parameters as $key => $value) {
            $templateContent = str_replace("{{ $key }}", $value, $templateContent);
        }

        return $templateContent;
    }
}
