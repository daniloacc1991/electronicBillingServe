import * as rpn from 'request-promise-native';
import { xml2json } from 'xml-js';
import * as xmlToJson from 'xml-to-json-stream';

export class ComfiarModel {

  private parser = xmlToJson( { attributeMode: false } );

  private optionsXml: Object = {
    compact: true,
    ignoreAttributes: true,
    ignoreComment: true,
    ignoreCdata: true,
    ignoreDeclaration: true,
    spaces: 0
  };

  public async login (user: string, password: string) {
    const _xml = `<IniciarSesion xmlns="http://comfiar.com.ar/webservice/">
    <usuarioId>${user}</usuarioId>
    <password>${password}</password>
    </IniciarSesion>`;

    try {
      const result = await this.apiDelcop(_xml, 'POST');
      return new Promise ( (resolve, reject) => {
        this.parser.xmlToJson( result, (err, json) => {
          if (err) {
            reject({
              stack: err
            });
          } else {
            resolve({
              token: json['soap:Envelope']['soap:Body'].IniciarSesionResponse.IniciarSesionResult.SesionId,
              date: json['soap:Envelope']['soap:Body'].IniciarSesionResponse.IniciarSesionResult.FechaVencimiento
            });
          }
        });
      });
    } catch (e) {
      this.parser.xmlToJson( e.error, (err, json) => {
        if (err) {
          throw {
            stack: err
          };
        } else {
          throw {
            stack: json['soap:Envelope']['soap:Body']['soap:Fault'].faultstring
          };
        }
      });
    }
  }

  public async enviarFactura (token: string, date: any, invoice: string) {
    const _xml = `<AutorizarComprobantesAsincronico xmlns="http://comfiar.com.ar/webservice/">
      <XML><![CDATA[${invoice}]]></XML>
      <cuitAProcesar>890208758</cuitAProcesar>
      <puntoDeVentaId>10001</puntoDeVentaId>
      <tipoDeComprobanteId>1</tipoDeComprobanteId>
      <formatoId>94</formatoId>
      <token>
        <SesionId>${token}</SesionId>
        <FechaVencimiento>${date}</FechaVencimiento>
      </token>
    </AutorizarComprobantesAsincronico>`;

    try {
      const result = await this.apiDelcop(_xml, 'POST');
      const _result = JSON.parse(xml2json(result, this.optionsXml));
      const data = JSON.parse(xml2json(_result['soap:Envelope']['soap:Body'].AutorizarComprobantesAsincronicoResponse.AutorizarComprobantesAsincronicoResult._text, this.optionsXml));
      return {
        fecha: data.SalidaTransaccion.Transaccion.Fecha._text,
        transaccion: data.SalidaTransaccion.Transaccion.ID._text,
      };
    } catch (e) {
      const err = JSON.parse(xml2json(e.error, this.optionsXml));
      throw {
        name: e.name,
        statusCode: e.statusCode,
        stack: err['soap:Envelope']['soap:Body']['soap:Fault'].faultstring._text
      };
    }
  }

  public async salidaTransaccion (token: string, date: any, transaccion: number) {
    const _xml = `<SalidaTransaccion xmlns="http://comfiar.com.ar/webservice/">
      <cuitId>890208758</cuitId>
      <transaccionId>${transaccion}</transaccionId>
      <token>
        <SesionId>${token}</SesionId>
        <FechaVencimiento>${date}</FechaVencimiento>
      </token>
    </SalidaTransaccion>`;

    try {
      const result = await this.apiDelcop(_xml, 'POST');
      const _result = JSON.parse(xml2json(result, this.optionsXml))['soap:Envelope']['soap:Body'].SalidaTransaccionResponse.SalidaTransaccionResult._text;
      const data = JSON.parse(xml2json(_result, this.optionsXml));
      return new Promise((resolve, reject) => {
        console.log(JSON.stringify(data));
        if (data.TransaccionError) {
          reject({
            statusCode: 200,
            stack: data
          });
        } else if (data.comprobantes.Comprobante.informacionComfiar.Estado._text === 'ERROR') {
          reject({
            statusCode: 200,
            stack: data.comprobantes.Comprobante.informacionComfiar.mensajes.mensaje.mensaje._text
          });
        } else if (data.comprobantes.Comprobante.informacionComfiar.Estado._text === 'ACEPTADO') {
          resolve(data.comprobantes.Transaccion);
        } else {
          reject(data);
        }
      });
      // return (data);
    } catch (e) {
      const err = JSON.parse(xml2json(e.error, this.optionsXml));
      throw {
        name: e.name,
        statusCode: e.statusCode,
        stack: err['soap:Envelope']['soap:Body']['soap:Fault'].faultstring._text
      };
    }
  }

  public async respuestaComprobante (token: string, date: any, invoice: string, transaccion: number) {
    let ventaId;
    const n = invoice.indexOf('-');
    if (n < 0) {
      ventaId = 10000;
    } else {
      ventaId = 10001;
      invoice = invoice.split('-')[1];
    }
    const _xml = `<RespuestaComprobante xmlns="http://comfiar.com.ar/webservice/">
      <cuitId>890208758</cuitId>
      <puntoDeVentaId>${ventaId}</puntoDeVentaId>
      <tipoDeComprobanteId>1</tipoDeComprobanteId>
      <nroCbte>${invoice}</nroCbte>
      <token>
        <SesionId>${token}</SesionId>
        <FechaVencimiento>${date}</FechaVencimiento>
      </token>
    </RespuestaComprobante>`;

    try {
      const result = await this.apiDelcop(_xml, 'POST');

      return new Promise((resolve, reject) => {
        const _result = JSON.parse(xml2json(result, this.optionsXml))['soap:Envelope']['soap:Body'].RespuestaComprobanteResponse.RespuestaComprobanteResult._text;
        const _data = JSON.parse(xml2json(_result, this.optionsXml));
        if (_data.ResponseError) {
          reject({
            statusCodeComfiar: 200,
            stack: _data.ResponseError.Error
          });
        } else {
          if ( _data.comprobantes.Comprobante.informacionComfiar.Estado._text === 'ERROR') {
            reject({
              stack: _data.comprobantes.Comprobante.informacionComfiar.mensajes.mensaje.mensaje._text
            });
          } else {
            this.parser.xmlToJson( _data.comprobantes.Comprobante.informacionOrganismo.ComprobanteProcesado._text, (err, json) => {
              if (err) {
                reject(err);
              }
              resolve({
                cufe: json['fe:Invoice']['cbc:UUID']
              });
            });
          }
        }
      });
    } catch (e) {
      const err = JSON.parse(xml2json(e.error, this.optionsXml));
      throw {
        name: e.name,
        statusCode: e.statusCode,
        stack: err['soap:Envelope']['soap:Body']['soap:Fault'].faultstring._text
      };
    }
  }

  public async consultarPDF (token: string, date: any, invoice: string, transaccion: number) {
    let ventaId;
    let prefix;
    const n = invoice.indexOf('-');
    if (n < 0) {
      ventaId = 10000;
    } else {
      ventaId = 10001;
      prefix = invoice.split('-')[0];
      invoice = invoice.split('-')[1];
    }
    const _xml = `<DescargarPdf xmlns="http://comfiar.com.ar/webservice/">
        <transaccionId>${transaccion}</transaccionId>
        <cuitId>890208758</cuitId>
        <puntoDeVentaId>${ventaId}</puntoDeVentaId>
        <tipoComprobanteId>1</tipoComprobanteId>
        <numeroComprobante>${invoice}</numeroComprobante>
        <token>
          <SesionId>${token}</SesionId>
          <FechaVencimiento>${date}</FechaVencimiento>
        </token>
      </DescargarPdf>`;

    try {
      const result = await this.apiDelcop(_xml, 'POST');
      const _result = JSON.parse(xml2json(result, this.optionsXml))['soap:Envelope']['soap:Body'].DescargarPdfResponse;
      return new Promise ( (resolve, reject) => {

        if (_result.DescargarPdfResult) {
          resolve(_result.DescargarPdfResult._text);
        } else {
          reject({
            statusCodeComfiar: 200,
            stack: 'No se encontró representación grafica',
            factura: `${prefix}-${invoice}`,
            transaccion: transaccion
          });
        }
      });
    } catch (e) {
      const err = JSON.parse(xml2json(e.error, this.optionsXml));
      throw {
        name: e.name,
        statusCode: e.statusCode,
        stack: err['soap:Envelope']['soap:Body']['soap:Fault'].faultstring._text
      };
    }
  }

  private apiDelcop (body: string, method: string): Promise<string> {
    const _xml = `<?xml version="1.0" encoding="utf-8"?>
    <soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
      <soap:Body>
        ${body}
      </soap:Body>
    </soap:Envelope>`;

    const options = {
      method: method,
      uri: 'http://test.comfiar.co/ws/WSComfiar.asmx',
      headers: {
        'User-Agent': 'Request-Promise',
        'Content-Type': 'text/xml; charset=utf-8',
        'Content-Length': Buffer.byteLength(_xml)
      },
      body: _xml,
      json: false
    };

    return new Promise((resolve, reject) => {
      rpn(options)
        .then((response) => {
          resolve(response);
        })
        .catch(err => {
          reject(err);
        });
    });
  }

}