import * as rpn from 'request-promise-native';
import * as config from 'config';
// import { xml2json } from 'xml-js';
import * as xmlToJson from 'xml-to-json-stream';

import { IRequestPromise } from '../../interfaces/rpn';

export class ComfiarModel {

  public async login(user: string, password: string) {
    const _xml = `<IniciarSesion xmlns="http://comfiar.com.ar/webservice/">
    <usuarioId>${user}</usuarioId>
    <password>${password}</password>
    </IniciarSesion>`;

    try {
      const result = await this.apiDelcop(_xml, 'POST');
      const _result = await this.xmlStream(result.response, false);
      if (_result['soap:Envelope']['soap:Body']['IniciarSesionResponse']) {
        return {
          token: _result['soap:Envelope']['soap:Body'].IniciarSesionResponse.IniciarSesionResult.SesionId,
          date: _result['soap:Envelope']['soap:Body'].IniciarSesionResponse.IniciarSesionResult.FechaVencimiento
        };
      } else {
        const _error = await this.xmlStream(_result, false);
        return Promise.reject({
          stack: {
            delete: false,
            msj: _error
          }
        });
      }
    } catch (e) {
      try {
        const error = await this.xmlStream(e.error, false);
        return Promise.reject({
          statusCode: e.statusCode,
          stack: {
            delete: false,
            msj: error['soap:Envelope']['soap:Body']['soap:Fault']['faultstring']
          }
        });
      } catch (e) {
        return Promise.reject({
          stack: {
            delete: false,
            msj: e.stack
          }
        });
      }
    }
  }

  public async enviarFactura(token: string, date: any, invoice: string, puntoVenta: number, tipoComprobante: number) {
    const _xml = `<AutorizarComprobantesAsincronico xmlns="http://comfiar.com.ar/webservice/">
      <XML><![CDATA[${invoice}]]></XML>
      <cuitAProcesar>890208758</cuitAProcesar>
      <puntoDeVentaId>${puntoVenta}</puntoDeVentaId>
      <tipoDeComprobanteId>${tipoComprobante}</tipoDeComprobanteId>
      <formatoId>87</formatoId>
      <token>
        <SesionId>${token}</SesionId>
        <FechaVencimiento>${date}</FechaVencimiento>
      </token>
    </AutorizarComprobantesAsincronico>`;

    try {
      const result = await this.apiDelcop(_xml, 'POST');
      const _result = await this.xmlStream(result.response, false);
      const rtaAPI = _result['soap:Envelope']['soap:Body'];
      if (rtaAPI.AutorizarComprobantesAsincronicoResponse.AutorizarComprobantesAsincronicoResult) {
        const data = await this.xmlStream(rtaAPI.AutorizarComprobantesAsincronicoResponse.AutorizarComprobantesAsincronicoResult, true, { one: '&lt;', two: '&gt;' });
        if (data.SalidaTransaccion.Transaccion.Error) {
          return Promise.reject({
            stack: {
              delete: true,
              msj: data.SalidaTransaccion.Transaccion.Error
            }
          });
        } else {
          return {
            fecha: data.SalidaTransaccion.Transaccion.Fecha,
            transaccion: data.SalidaTransaccion.Transaccion.ID,
          };
        }
      } else {
        return Promise.reject({
          stack: {
            delete: true,
            msj: rtaAPI
          }
        });
      }

    } catch (e) {
      try {
        const error = await this.xmlStream(e.error, false);
        return Promise.reject({
          statusCode: e.statusCode,
          stack: {
            delete: false,
            msj: error['soap:Envelope']['soap:Body']['soap:Fault']['faultstring']
          }
        });
      } catch (e) {
        return Promise.reject({
          stack: {
            delete: false,
            msj: e.stack
          }
        });
      }
    }
  }

  public async salidaTransaccion(token: string, date: any, transaccion: number) {
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
      const _result = await this.xmlStream(result.response, false);

      if (_result['soap:Envelope']['soap:Body'].SalidaTransaccionResponse.SalidaTransaccionResult) {
        const _transaccion = await this.xmlStream(_result['soap:Envelope']['soap:Body'].SalidaTransaccionResponse.SalidaTransaccionResult, true, { one: '&lt;', two: '&gt;' });

        if (_transaccion.TransaccionError) {
          return Promise.reject({
            stack: {
              delete: true,
              msj: _transaccion.TransaccionError.Error
            }
          });
        } else if (_transaccion.TransaccionSinTerminar) {
          return Promise.resolve(_transaccion.TransaccionSinTerminar);
        } else {
          return Promise.resolve(_transaccion.comprobantes.Transaccion);
        }

      } else {
        return Promise.reject({
          stack: {
            delete: false,
            msj: _result
          }
        });
      }
    } catch (e) {
      try {
        const error = await this.xmlStream(e.error, false);
        return Promise.reject({
          statusCode: e.statusCode,
          stack: {
            delete: false,
            msj: error['soap:Envelope']['soap:Body']['soap:Fault']['faultstring']
          }
        });
      } catch (e) {
        return Promise.reject({
          stack: {
            delete: false,
            msj: e.stack
          }
        });
      }
    }
  }

  public async respuestaComprobante(token: string, date: any, invoice: string, puntoVenta: number, tipoComprobante: number) {
    console.log(tipoComprobante);
    const tagRta = await this.nameEquiqueta(tipoComprobante);
    console.log(tagRta);
    const n = invoice.indexOf('-');
    const factura = invoice;
    if (n < 0) {
    } else {
      invoice = invoice.split('-')[1];
    }
    const _xml = `<RespuestaComprobante xmlns="http://comfiar.com.ar/webservice/">
      <cuitId>890208758</cuitId>
      <puntoDeVentaId>${puntoVenta}</puntoDeVentaId>
      <tipoDeComprobanteId>${tipoComprobante}</tipoDeComprobanteId>
      <nroCbte>${invoice}</nroCbte>
      <token>
        <SesionId>${token}</SesionId>
        <FechaVencimiento>${date}</FechaVencimiento>
      </token>
    </RespuestaComprobante>`;
    let result;
    try {
      result = await this.apiDelcop(_xml, 'POST');
    } catch (e) {
      const error = await this.xmlStream(e.error, false);
      return Promise.reject({
        statusCode: e.statusCode,
        stack: {
          delete: false,
          msj: error['soap:Envelope']['soap:Body']['soap:Fault']['faultstring']
        }
      });
    }

    try {
      const _result = await this.xmlStream(result.response, false);
      if (_result['soap:Envelope']['soap:Body'].RespuestaComprobanteResponse.RespuestaComprobanteResult) {
        const _comprobante = await this.xmlStream(_result['soap:Envelope']['soap:Body'].RespuestaComprobanteResponse.RespuestaComprobanteResult, true, { one: '&lt;', two: '&gt;' });

        if (_comprobante.ResponseError) {
          return Promise.reject({
            stack: {
              delete: true,
              msj: _comprobante.ResponseError.Error
            }
          });
        }
        const infoComfiar = _comprobante.comprobantes.Comprobante.informacionComfiar;

        if (infoComfiar.Estado === 'ERROR') {
          return Promise.reject({
            stack: {
              delete: true,
              estado: infoComfiar.Estado,
              id: infoComfiar.mensajes.mensaje.identificador,
              msj: infoComfiar.mensajes.mensaje.mensaje,
            }
          });
        } else if (infoComfiar.Estado === 'RECHAZADO' || infoComfiar.Estado === 'AUTORIZADO') {
          const _factura = await this.xmlStream(_comprobante.comprobantes.Comprobante.informacionOrganismo.ComprobanteProcesado, true, { one: '&amp;lt;', two: '&amp;gt;' });
          const rtaDian = await this.xmlStream(_comprobante.comprobantes.Comprobante.RespuestaDIAN, true, { one: '&amp;lt;', two: '&amp;gt;' });
          return {
            transaccion: _comprobante.comprobantes.Transaccion.ID,
            invoice: factura,
            cufe: _factura[tagRta]['cbc:UUID'],
            estado: infoComfiar.Estado,
            id: rtaDian.RespuestaDIAN.Cod ? rtaDian.RespuestaDIAN.Cod : infoComfiar.mensajes.mensaje.identificador,
            msj: rtaDian.RespuestaDIAN.Comments ? rtaDian.RespuestaDIAN.Comments : infoComfiar.mensajes.mensaje.mensaje,
            ReceivedDateTime: rtaDian.RespuestaDIAN.ReceivedDateTime,
            ResponseDateTime: rtaDian.RespuestaDIAN.ResponseDateTime,
            estadoDIAN: rtaDian.RespuestaDIAN.DescripcionEstado ? rtaDian.RespuestaDIAN.DescripcionEstado : '',
          };
        } else if (infoComfiar.Estado === 'ACEPTADO') {
          const _factura = await this.xmlStream(_comprobante.comprobantes.Comprobante.informacionOrganismo.ComprobanteProcesado, true, { one: '&amp;lt;', two: '&amp;gt;' });
          if (!_comprobante.comprobantes.Comprobante.RespuestaDIAN) {
            return {
              transaccion: _comprobante.comprobantes.Transaccion.ID,
              invoice: factura,
              cufe: _factura[tagRta]['cbc:UUID'],
              estado: infoComfiar.Estado
            };
          } else {
            const rtaDian = await this.xmlStream(_comprobante.comprobantes.Comprobante.RespuestaDIAN, true, { one: '&amp;lt;', two: '&amp;gt;' });
            return {
              transaccion: _comprobante.comprobantes.Transaccion.ID,
              invoice: factura,
              cufe: _factura[tagRta]['cbc:UUID'],
              estado: infoComfiar.Estado,
              id: rtaDian.RespuestaDIAN.Cod ? rtaDian.RespuestaDIAN.Cod : infoComfiar.mensajes.mensaje.identificador,
              msj: rtaDian.RespuestaDIAN.Comments ? rtaDian.RespuestaDIAN.Comments : infoComfiar.mensajes.mensaje.mensaje,
              ReceivedDateTime: rtaDian.RespuestaDIAN.ReceivedDateTime,
              ResponseDateTime: rtaDian.RespuestaDIAN.ResponseDateTime,
              estadoDIAN: rtaDian.RespuestaDIAN.DescripcionEstado ? rtaDian.RespuestaDIAN.DescripcionEstado : '',
            };
          }
        } else {
          const _factura = await this.xmlStream(_comprobante.comprobantes.Comprobante.informacionOrganismo.ComprobanteProcesado, true, { one: '&amp;lt;', two: '&amp;gt;' });
          return {
            transaccion: _comprobante.comprobantes.Transaccion.ID,
            invoice: factura,
            cufe: _factura[tagRta]['cbc:UUID'],
            estado: infoComfiar.Estado,
            msj: 'Informar a sistema el estado actual'
          };
        }
      }
      return Promise.reject({
        stack: {
          delete: false,
          msj: _result
        }
      });
    } catch (e) {
      return Promise.reject({
        stack: {
          delete: false,
          msj: e.stack
        }
      });
    }
  }

  public async consultarPDF(token: string, date: any, invoice: string, transaccion: number, puntoVenta: number, tipoComprobante: number) {
    let prefix;
    const n = invoice.indexOf('-');
    if (n < 0) {
    } else {
      prefix = invoice.split('-')[0];
      invoice = invoice.split('-')[1];
    }
    const _xml = `<DescargarPdf xmlns="http://comfiar.com.ar/webservice/">
        <transaccionId>${transaccion}</transaccionId>
        <cuitId>890208758</cuitId>
        <puntoDeVentaId>${puntoVenta}</puntoDeVentaId>
        <tipoComprobanteId>${tipoComprobante}</tipoComprobanteId>
        <numeroComprobante>${invoice}</numeroComprobante>
        <token>
          <SesionId>${token}</SesionId>
          <FechaVencimiento>${date}</FechaVencimiento>
        </token>
      </DescargarPdf>`;

    try {
      const result = await this.apiDelcop(_xml, 'POST');
      const _result = await this.xmlStream(result.response, false);
      const rtsAPI = _result['soap:Envelope']['soap:Body'];

      return new Promise((resolve, reject) => {
        if (rtsAPI.DescargarPdfResponse.DescargarPdfResult) {
          resolve(rtsAPI.DescargarPdfResponse.DescargarPdfResult);
        } else {
          reject({
            stack: 'No se encontró representación grafica',
            factura: `${prefix}-${invoice}`,
            transaccion: transaccion
          });
        }
      });

    } catch (e) {
      try {
        const error = await this.xmlStream(e.error, false);
        throw ({
          statusCode: e.statusCode,
          stack: error['soap:Envelope']['soap:Body']['soap:Fault']['faultstring']
        });
      } catch (e) {
        throw {
          stack: {
            delete: false,
            msj: e.stack
          }
        };
      }
    }
  }

  private apiDelcop(body: string, method: string): Promise<IRequestPromise> {
    const _xml = `<?xml version="1.0" encoding="utf-8"?>
    <soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
      <soap:Body>
        ${body}
      </soap:Body>
    </soap:Envelope>`;
    const options = {
      method: method,
      uri: config.get('serverComfiar'),
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
          const res = {
            statusCode: response.statusCode,
            response: response
          };
          resolve(res);
        })
        .catch(err => {
          reject(err);
        });
    });
  }

  private async xmlStream(xml: any, replace: boolean, findtext?: { one: string, two: string }): Promise<any> {
    return new Promise((resolve, reject) => {
      const parser = xmlToJson({ attributeMode: false });
      let xmlDian = xml;
      xmlDian = replace ? xmlDian.replace(new RegExp(findtext.one, 'g'), '<') : xmlDian;
      xmlDian = replace ? xmlDian.replace(new RegExp(findtext.two, 'g'), '>') : xmlDian;

      parser.xmlToJson(xmlDian, (err, res) => {
        if (err) {
          reject(err);
        } else {
          resolve(res);
        }
      });
    });
  }

  private async nameEquiqueta(tipoComprobante: number) {
    if (tipoComprobante == 1) {
      return 'fe:Invoice';
    } else if (tipoComprobante == 4) {
      return 'fe:CreditNote';
    } else if (tipoComprobante == 5) {
      return 'fe:DebitNote';
    }
  }

  // private async xmlJs(xml) {
  //   return new Promise((resolve, reject) => {
  //     const optionsXml = {
  //       compact: true,
  //       ignoreAttributes: true,
  //       ignoreComment: true,
  //       ignoreCdata: true,
  //       ignoreDeclaration: true,
  //       spaces: 0
  //     };
  //     const xmlDian = xml;
  //     // xmlDian = xmlDian.replace(new RegExp('&lt;', 'g'), '<');
  //     // xmlDian = xmlDian.replace(new RegExp('&gt;', 'g'), '>');
  //     try {
  //       const result = xml2json(xmlDian, optionsXml);
  //       const json = JSON.parse(result);
  //       resolve(json);
  //     } catch (e) {
  //       reject(e);
  //     }
  //   });
  // }
}