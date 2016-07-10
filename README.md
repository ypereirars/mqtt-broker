# Broker
MQTT broker implementado em JavaScript - Node JS utilizando [Mosca](https://github.com/mcollina/mosca).

## Requisitos:
* Node.JS 

## Instalação: 
* ```npm install``` para instalar as dependências
* ```npm start``` para iniciar o broker

_O broker será iniciado na porta *1884*._

```CTRL+C``` Para a execução.

## Funcionamento: 
Os dados serão enviados através de um módulo Arduino+ESP8266 [https://github.com/ypereirars/arduino-baja] utilizando o protocolo MQTT.

### Formato das Mensagens:
O tópico será dividido em seções, como a seguir:

```
ID/device/sensor
```

e, este tópico possui o valor do sensor como payload.

onde:

* **ID**:     Identificação do dispositivo
* **Device**: Dispositivo que está enviando os dados
* **Sensor**: Sensor o qual envia os dados
* **Value**:  Valor da leitura do sensor

Logo, cada pacote tem a seguinte forma: 

Portanto, um pacote tem o seguinte formato:
```
{
  topic:    'ID/device/sensor',
  payload:  <value>,
  qos:      0,
  retain:   <boolean>
}
```
