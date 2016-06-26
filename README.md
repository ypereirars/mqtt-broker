# Broker
MQTT broker feito em JavaScript - Node JS utilizando [Mosca](https://github.com/mcollina/mosca). Este Broker é tem como atribuição repassar as mensagens recebidas preparadas e/ou agregadas, prontas para serem consumidas por um outro serviço. Neste caso, um *consumer* será um [Dashboard](https://github.com/ypereirars/baja-dashboard) e outro um banco de dados local.

## Como Funciona:
O Broker receberá dados de um veículo _off-road_ Baja. Os dados serão enviados através de um módulo Arduino+ESP8266 [https://github.com/ypereirars/arduino-baja] utilizando o protocolo MQTT. 
#### Formato das Mensagens: 
O tópico será dividido em seções, como a seguir:
```
ID/device/sensor
```

onde:
```
  ID:     Identificação do dispositivo
  Device: Dispositivo que está enviando os dados
  Sensor: Sensor o qual envia os dados
  Value:  Valor da leitura do sensor
```

As mensagens vem do ESP8266 da seguinte forma:
```
 topic:   ID/device/sensor
 payload: value
```

Portanto, um pacote tem o seguinte formato: 
```
{
  topic:    'ID/device/sensor',
  payload:  <value>,
  qos:      0,
  retain:   <boolean>
}
```
Obs.: Há uma limitação quanto ao QoS (Quality of Service), pois a biblioteca PubSubClient para o ESP8266/Arduino só aceita QoS 0 ou 1.

Após o broker repassar esse pacote, pode-se agregar as mensagens provenientes de um mesmo dispositivo com a mesma ID, portanto, o pacote poderá ter ou a forma anterior ou a seguinte: 

```
{
  topic:    'ID/device/#',
  payload:  {
    <sensor1>: <value>,
    <sensor2>: <value>
  },
  qos:      0,
  retain:   #boolean
}
```
