import { NoteHeader, NoteBody, InvoiceBody, InvoiceHeader } from './';

export class XmlAdmin {

  // tslint:disable:quotemark
  async headerInvoice(encabezado: InvoiceHeader) {
    return Promise.resolve({
      "@": {
        "xmlns:fe": "http://www.dian.gov.co/contratos/facturaelectronica/v1",
        "xmlns": "urn:oasis:names:specification:ubl:schema:xsd:Invoice-2",
        "xmlns:cac": "urn:oasis:names:specification:ubl:schema:xsd:CommonAggregateComponents-2",
        "xmlns:cbc": "urn:oasis:names:specification:ubl:schema:xsd:CommonBasicComponents-2",
        "xmlns:ccts": "urn:un:unece:uncefact:documentation:2",
        "xmlns:clm54217": "urn:un:unece:uncefact:codelist:specification:54217:2001",
        "xmlns:clm66411": "urn:un:unece:uncefact:codelist:specification:66411:2001",
        "xmlns:clmIANAMIMEMediaType": "urn:un:unece:uncefact:codelist:specification:IANAMIMEMediaType:2003",
        "xmlns:ds": "http://www.w3.org/2000/09/xmldsig#",
        "xmlns:ext": "urn:oasis:names:specification:ubl:schema:xsd:CommonExtensionComponents-2",
        "xmlns:qdt": "urn:oasis:names:specification:ubl:schema:xsd:QualifiedDatatypes-2",
        "xmlns:sac": "urn:sunat:names:specification:ubl:peru:schema:xsd:SunatAggregateComponents-1",
        "xmlns:sts": "http://www.dian.gov.co/contratos/facturaelectronica/v1/Structures",
        "xmlns:udt": "urn:un:unece:uncefact:data:specification:UnqualifiedDataTypesSchemaModule:2",
        "xmlns:xsd": "http://www.w3.org/2001/XMLSchema",
        "xmlns:xsi": "http://www.w3.org/2001/XMLSchema-instance"
      },
      "ext:UBLExtensions": {
        "ext:UBLExtension": {
          "ext:ExtensionContent": {
            "sts:DianExtensions": {
              "sts:InvoiceControl": {
                "sts:InvoiceAuthorization": encabezado.invoiceauthorization,
                "sts:AuthorizationPeriod": {
                  "cbc:StartDate": encabezado.startdate,
                  "cbc:EndDate": encabezado.enddate
                },
                "sts:AuthorizedInvoices": {
                  "sts:Prefix": encabezado.prefix,
                  "sts:From": encabezado.rfrom,
                  "sts:To": encabezado.rto
                }
              },
              "sts:InvoiceSource": {
                "cbc:IdentificationCode": {
                  "@": {
                    "listAgencyID": 6,
                    "listAgencyName": "United Nations Economic Commission for Europe",
                    "listSchemeURI": "urn:oasis:names:specification:ubl:codelist:gc:CountryIdentificationCode2.0"
                  },
                  "#": "CO"
                }
              },
              "sts:SoftwareProvider": {
                "sts:ProviderID": {
                  "@": {
                    "schemeAgencyID": "195",
                    "schemeAgencyName": "CO, DIAN (Direccion de Impuestos y Aduanas Nacionales)"
                  },
                  "#": ""
                },
                "sts:SoftwareID": {
                  "@": {
                    "schemeAgencyID": "195",
                    "schemeAgencyName": "CO, DIAN (Direccion de Impuestos y Aduanas Nacionales)"
                  },
                  "#": ""
                }
              },
              "sts:SoftwareSecurityCode": {
                "@": {
                  "schemeAgencyID": "195",
                  "schemeAgencyName": "CO, DIAN (Direccion de Impuestos y Aduanas Nacionales)"
                },
                "#": ""
              }
            }
          }
        }
      },
      "cbc:UBLVersionID": "UBL 2.0",
      "cbc:ProfileID": "DIAN 1.0",
      "cbc:ID": encabezado.prefix + encabezado.invoice,
      "cbc:UUID": {
        "@": {
          "schemeAgencyID": "195",
          "schemeAgencyName": "CO, DIAN (Direccion de Impuestos y Aduanas Nacionales)"
        },
        "#": ""
      },
      "cbc:IssueDate": encabezado.issuedate,
      "cbc:IssueTime": encabezado.issuetime,
      "cbc:InvoiceTypeCode": {
        "@": {
          "listAgencyID": "6",
          "listAgencyName": "United Nations Economic Commission for Europe",
          "listSchemeURI": "urn:oasis:names:specification:ubl:codelist:gc:CountryIdentificationCode2.0"
        },
        "#": 1
      },
      "cbc:Note": [
        {
          "#": encabezado.datein
        },
        {
          "#": encabezado.dateout
        },
        {
          "#": encabezado.observation
        },
        {
          "#": encabezado.producedby
        },
        {
          "#": encabezado.printdate
        },
        {
          "#": encabezado.register
        },
        {
          "#": encabezado.totaldiscount
        },
        {
          "#": encabezado.codediscount
        }
      ],
      "cbc:DocumentCurrencyCode": "COP",
      "cac:BillingReference": {
        "cac:InvoiceDocumentReference": {
          "cbc:ID": encabezado.typeinvoce
        }
      },
      "cac:ContractDocumentReference": {
        "cbc:ID": encabezado.contract
      },
      "cac:AdditionalDocumentReference": {
        "cbc:ID": encabezado.register.replace(new RegExp('Ń', 'g'), 'Ñ'),
        "cbc:DocumentType": encabezado.identificationpatient
      },
      "fe:AccountingSupplierParty": {
        "cbc:AdditionalAccountID": encabezado.companyaccountid,
        "fe:Party": {
          "cac:PartyIdentification": {
            "cbc:ID": {
              "@": {
                "schemeAgencyID": "195",
                "schemeAgencyName": "CO, DIAN (Direccion de Impuestos y Aduanas Nacionales)",
                "schemeID": encabezado.companytypedocument
              },
              "#": encabezado.companydocument
            }
          },
          "cac:PartyName": {
            "cbc:Name": encabezado.companyname.replace(new RegExp('Ń', 'g'), 'Ñ'),
          },
          "fe:PhysicalLocation": {
            "fe:Address": {
              "cbc:Department": encabezado.companydepartment,
              "cbc:CityName": encabezado.companycity,
              "cac:AddressLine": {
                "cbc:Line": encabezado.companyaddress
              },
              "cac:Country": {
                "cbc:IdentificationCode": "CO"
              }
            }
          },
          "fe:PartyTaxScheme": {
            "cbc:TaxLevelCode": encabezado.companyregimen,
            "cac:TaxScheme": ""
          },
          "fe:PartyLegalEntity": {
            "cbc:RegistrationName": encabezado.companyname.replace(new RegExp('Ń', 'g'), 'Ñ'),
          },
          "cac:Contact": {
            "cbc:Telephone": encabezado.companytelephone
          }
        }
      },
      "fe:AccountingCustomerParty": {
        "cbc:AdditionalAccountID": encabezado.clientaccountid,
        "fe:Party": {
          "cac:PartyIdentification": {
            "cbc:ID": {
              "@": {
                "schemeAgencyID": "195",
                "schemeAgencyName": "CO, DIAN (Direccion de Impuestos y Aduanas Nacionales)",
                "schemeID": encabezado.clienttypedocument
              },
              "#": encabezado.clientdocument
            }
          },
          "fe:PhysicalLocation": {
            "fe:Address": {
              "cbc:Department": encabezado.clientdepartment,
              "cbc:CityName": encabezado.clientcity,
              "cac:AddressLine": {
                "cbc:Line": encabezado.clientaddress.toLocaleUpperCase()
              },
              "cac:Country": {
                "cbc:IdentificationCode": "CO"
              }
            }
          },
          "fe:PartyTaxScheme": {
            "cbc:TaxLevelCode": encabezado.clientregimen,
            "cac:TaxScheme": ""
          },
          "fe:PartyLegalEntity": {
            "cbc:RegistrationName": encabezado.clientname.replace(new RegExp('Ń', 'g'), 'Ñ'),
          },
          "cac:Contact": {
            "cbc:Telephone": encabezado.clienttelephone,
            "cbc:ElectronicMail": encabezado.clientemail,
            "cbc:Note": encabezado.plan
          },
          "fe:Person": {
            "cbc:FirstName": encabezado.clientaccountid === 2 ? encabezado.firstname.replace(new RegExp('Ń', 'g'), 'Ñ') : "CLIENTE",
            "cbc:FamilyName": encabezado.clientaccountid === 2 ? encabezado.familyname.replace(new RegExp('Ń', 'g'), 'Ñ') : "",
            "cbc:MiddleName": encabezado.clientaccountid === 2 ? encabezado.middlename.replace(new RegExp('Ń', 'g'), 'Ñ') : ""
          }
        }
      },
      "cac:PaymentMeans": {
        "cbc:PaymentMeansCode": "41",
        "cbc:PaymentDueDate": encabezado.paymentduedate
      },
      "fe:TaxTotal": {
        "cbc:TaxAmount": {
          "@": {
            "currencyID": "COP"
          },
          "#": 0.00
        },
        "cbc:TaxEvidenceIndicator": false,
        "fe:TaxSubtotal": {
          "cbc:TaxableAmount": {
            "@": {
              "currencyID": "COP"
            },
            "#": 0.00
          },
          "cbc:TaxAmount": {
            "@": {
              "currencyID": "COP"
            },
            "#": 0.00
          },
          "cbc:Percent": 0.00,
          "cac:TaxCategory": {
            "cac:TaxScheme": {
              "cbc:ID": "01"
            }
          }
        }
      },
      "fe:LegalMonetaryTotal": {
        "cbc:LineExtensionAmount": {
          "@": {
            "currencyID": "COP"
          },
          "#": encabezado.subtotal
        },
        "cbc:TaxExclusiveAmount": {
          "@": {
            "currencyID": "COP"
          },
          "#": 0.00
        },
        "cbc:AllowanceTotalAmount": {
          "@": {
            "currencyID": "COP"
          },
          "#": encabezado.totaldiscount
        },
        "cbc:PayableAmount": {
          "@": {
            "currencyID": "COP"
          },
          "#": encabezado.total
        }
      },
      "fe:InvoiceLine": []
    });
  }

  bodyInvoice(detalle: InvoiceBody, typeInvoce: string, cb) {
    console.log(typeInvoce);
    console.log(detalle);
    if (typeInvoce == "R") {
      cb({
        "cbc:ID": detalle.id,
        "cbc:InvoicedQuantity": detalle.invoicedquantity,
        "cbc:LineExtensionAmount": {
          "@": {
            "currencyID": "COP"
          },
          "#": detalle.lineextensionamount
        },
        "fe:Item": {
          "cbc:Description": detalle.description.replace(new RegExp('Ń', 'g'), 'Ñ'),
        },
        "fe:Price": {
          "cbc:PriceAmount": {
            "@": {
              "currencyID": "COP"
            },
            "#": detalle.priceamount
          }
        }
      });
    } else if (typeInvoce == "D" || typeInvoce == "H") {
      cb({
        "cbc:ID": detalle.id,
        "cbc:Note": detalle.concepto.replace(new RegExp('Ń', 'g'), 'Ñ'),
        "cbc:InvoicedQuantity": detalle.invoicedquantity,
        "cbc:LineExtensionAmount": {
          "@": {
            "currencyID": "COP"
          },
          "#": detalle.lineextensionamount
        },
        "fe:Item": {
          "cbc:Description": detalle.description.replace(new RegExp('Ń', 'g'), 'Ñ'),
          "cac:ManufacturersItemIdentification": {
            "cbc:ID": detalle.servicio
          },
          "cac:AdditionalItemProperty": {
            "cbc:Name": "Total Grupo",
            "cbc:Value": detalle.totalconcepto
          }
        },
        "fe:Price": {
          "cbc:PriceAmount": {
            "@": {
              "currencyID": "COP"
            },
            "#": detalle.priceamount
          }
        }
      });
    } else if (typeInvoce == "P") {
      cb({
        "cbc:ID": detalle.id,
        "cbc:InvoicedQuantity": detalle.invoicedquantity,
        "cbc:LineExtensionAmount": {
          "@": {
            "currencyID": "COP"
          },
          "#": detalle.lineextensionamount
        },
        "fe:Item": {
          "cbc:Description": detalle.description,
          "cac:ManufacturersItemIdentification": {
            "cbc:ID": detalle.servicio
          }
        },
        "fe:Price": {
          "cbc:PriceAmount": {
            "@": {
              "currencyID": "COP"
            },
            "#": detalle.priceamount
          }
        }
      });
    }
  }

  async headerNote(nota: NoteHeader) {
    return Promise.resolve({
      "@": {
        "xmlns:fe": "http://www.dian.gov.co/contratos/facturaelectronica/v1",
        "xmlns": "urn:oasis:names:specification:ubl:schema:xsd:Invoice-2",
        "xmlns:cac": "urn:oasis:names:specification:ubl:schema:xsd:CommonAggregateComponents-2",
        "xmlns:cbc": "urn:oasis:names:specification:ubl:schema:xsd:CommonBasicComponents-2",
        "xmlns:ccts": "urn:un:unece:uncefact:documentation:2",
        "xmlns:clm54217": "urn:un:unece:uncefact:codelist:specification:54217:2001",
        "xmlns:clm66411": "urn:un:unece:uncefact:codelist:specification:66411:2001",
        "xmlns:clmIANAMIMEMediaType": "urn:un:unece:uncefact:codelist:specification:IANAMIMEMediaType:2003",
        "xmlns:ds": "http://www.w3.org/2000/09/xmldsig#",
        "xmlns:ext": "urn:oasis:names:specification:ubl:schema:xsd:CommonExtensionComponents-2",
        "xmlns:qdt": "urn:oasis:names:specification:ubl:schema:xsd:QualifiedDatatypes-2",
        "xmlns:sac": "urn:sunat:names:specification:ubl:peru:schema:xsd:SunatAggregateComponents-1",
        "xmlns:sts": "http://www.dian.gov.co/contratos/facturaelectronica/v1/Structures",
        "xmlns:udt": "urn:un:unece:uncefact:data:specification:UnqualifiedDataTypesSchemaModule:2",
        "xmlns:xsd": "http://www.w3.org/2001/XMLSchema",
        "xmlns:xsi": "http://www.w3.org/2001/XMLSchema-instance"
      },
      "ext:UBLExtensions": {
        "ext:UBLExtension": {
          "ext:ExtensionContent": {
            "sts:DianExtensions": {
              "sts:InvoiceControl": {
                "sts:InvoiceAuthorization": nota.invoiceauthorization,
                "sts:AuthorizationPeriod": {
                  "cbc:StartDate": nota.startdate,
                  "cbc:EndDate": nota.enddate
                },
                "sts:AuthorizedInvoices": {
                  "sts:Prefix": "",
                  "sts:From": nota.rfrom,
                  "sts:To": nota.rto
                }
              },
              "sts:InvoiceSource": {
                "cbc:IdentificationCode": {
                  "@": {
                    "listAgencyID": 6,
                    "listAgencyName": "United Nations Economic Commission for Europe",
                    "listSchemeURI": "urn:oasis:names:specification:ubl:codelist:gc:CountryIdentificationCode2.0"
                  },
                  "#": "CO"
                }
              },
              "sts:SoftwareProvider": {
                "sts:ProviderID": {
                  "@": {
                    "schemeAgencyID": 195,
                    "schemeAgencyName": "CO, DIAN (Direccion de Impuestos y Aduanas Nacionales)"
                  },
                  "#": ""
                },
                "sts:SoftwareID": {
                  "@": {
                    "schemeAgencyID": 195,
                    "schemeAgencyName": "CO, DIAN (Direccion de Impuestos y Aduanas Nacionales)"
                  },
                  "#": ""
                }
              },
              "sts:SoftwareSecurityCode": {
                "@": {
                  "schemeAgencyID": 195,
                  "schemeAgencyName": "CO, DIAN (Direccion de Impuestos y Aduanas Nacionales)"
                },
                "#": ""
              }
            }
          }
        }
      },
      "cbc:UBLVersionID": "UBL 2.0",
      "cbc:CustomizationID": "urn:oasis:names:specification:ubl:xpath:Order-2.0:sbs-1.0-draft",
      "cbc:ProfileID": "DIAN 1.0",
      "cbc:ID": nota.note,
      "cbc:UUID": {
        "@": {
          "schemeAgencyID": "195",
          "schemeAgencyName": "CO, DIAN (Direccion de Impuestos y Aduanas Nacionales)"
        },
        "#": ""
      },
      "cbc:IssueDate": nota.issuedate,
      "cbc:IssueTime": nota.issuetime,
      "cbc:Note": [
        {
          "#": nota.datein
        },
        {
          "#": nota.dateout
        },
        {
          "#": nota.observation ? nota.observation : ''
        },
        {
          "#": nota.producedby.replace(new RegExp('Ń', 'g'), 'Ñ')
        },
        {
          "#": nota.printdate
        },
        {
          "#": nota.cufe
        },
        {
          "#": nota.register.replace(new RegExp('Ń', 'g'), 'Ñ')
        }
      ],
      "cbc:DocumentCurrencyCode": "COP",
      "cac:OrderReference": {
        "cbc:ID": nota.contract
      },
      "cac:BillingReference": {
        "cac:InvoiceDocumentReference": {
          "cbc:ID": nota.invoice,
          "cbc:UUID": nota.cufe,
          "cbc:IssueDate": nota.issuedateinvoice
        }
      },
      "cac:AdditionalDocumentReference": {
        "cbc:ID": nota.register.replace(new RegExp('Ń', 'g'), 'Ñ'),
        "cbc:DocumentType": nota.identificationpatient
      },
      "fe:AccountingSupplierParty": {
        "cbc:AdditionalAccountID": nota.companyaccountid,
        "fe:Party": {
          "cac:PartyIdentification": {
            "cbc:ID": {
              "@": {
                "schemeAgencyID": 195,
                "schemeAgencyName": "CO, DIAN (Direccion de Impuestos y Aduanas Nacionales)",
                "schemeID": nota.companytypedocument
              },
              "#": nota.companydocument
            }
          },
          "cac:PartyName": {
            "cbc:Name": nota.companyname
          },
          "fe:PhysicalLocation": {
            "fe:Address": {
              "cbc:Department": nota.companydepartment,
              "cbc:CityName": nota.companycity,
              "cac:AddressLine": {
                "cbc:Line": nota.companyaddress,
              },
              "cac:Country": {
                "cbc:IdentificationCode": "CO"
              }
            }
          },
          "fe:PartyTaxScheme": {
            "cbc:TaxLevelCode": nota.companyregimen,
            "cac:TaxScheme": ""
          },
          "fe:PartyLegalEntity": {
            "cbc:RegistrationName": nota.companyname
          },
          "cac:Contact": {
            "cbc:Telephone": nota.companytelephone
          }
        }
      },
      "fe:AccountingCustomerParty": {
        "cbc:AdditionalAccountID": nota.clientaccountid,
        "fe:Party": {
          "cac:PartyIdentification": {
            "cbc:ID": {
              "@": {
                "schemeAgencyID": 195,
                "schemeAgencyName": "CO, DIAN (Direccion de Impuestos y Aduanas Nacionales)",
                "schemeID": nota.clienttypedocument
              },
              "#": nota.clientdocument
            }
          },
          "fe:PhysicalLocation": {
            "fe:Address": {
              "cbc:Department": nota.clientdepartment,
              "cbc:CityName": nota.clientcity,
              "cac:AddressLine": {
                "cbc:Line": nota.clientaddress
              },
              "cac:Country": {
                "cbc:IdentificationCode": "CO"
              }
            }
          },
          "fe:PartyTaxScheme": {
            "cbc:TaxLevelCode": nota.clientregimen,
            "cac:TaxScheme": ""
          },
          "fe:PartyLegalEntity": {
            "cbc:RegistrationName": nota.clientname.replace(new RegExp('Ń', 'g'), 'Ñ')
          },
          "cac:Contact": {
            "cbc:Telephone": nota.clienttelephone,
            "cbc:Note": nota.plan
          },
          "fe:Person": {
            "cbc:FirstName": nota.clientaccountid === 2 ? nota.firstname.replace(new RegExp('Ń', 'g'), 'Ñ') : "CLIENTE",
            "cbc:FamilyName": nota.clientaccountid === 2 ? nota.familyname.replace(new RegExp('Ń', 'g'), 'Ñ') : "",
            "cbc:MiddleName": nota.clientaccountid === 2 ? nota.middlename.replace(new RegExp('Ń', 'g'), 'Ñ') : ""
          }
        }
      },
      "fe:TaxTotal": {
        "cbc:TaxAmount": {
          "@": {
            "currencyID": "COP"
          },
          "#": 0
        },
        "cbc:TaxEvidenceIndicator": false,
        "fe:TaxSubtotal": {
          "cbc:TaxableAmount": {
            "@": {
              "currencyID": "COP"
            },
            "#": 0.00
          },
          "cbc:TaxAmount": {
            "@": {
              "currencyID": "COP"
            },
            "#": 0.00
          },
          "cbc:Percent": 0.00,
          "cac:TaxCategory": {
            "cac:TaxScheme": {
              "cbc:ID": "01"
            }
          }
        }
      },
      "fe:LegalMonetaryTotal": {
        "cbc:LineExtensionAmount": {
          "@": {
            "currencyID": "COP"
          },
          "#": nota.price
        },
        "cbc:TaxExclusiveAmount": {
          "@": {
            "currencyID": "COP"
          },
          "#": 0.00
        },
        "cbc:AllowanceTotalAmount": {
          "@": {
            "currencyID": "COP"
          },
          "#": 0.00
        },
        "cbc:PayableAmount": {
          "@": {
            "currencyID": "COP"
          },
          "#": nota.price
        }
      }
    });
  }

  bodyNote(note: NoteBody, typeNote: string, cb) {
    if ('cac:CreditNoteLine' == typeNote) {
      return cb({
        "cbc:ID": {
          "@": {
            "schemeAgencyID": 195,
            "schemeAgencyName": "CO, DIAN (Direccion de Impuestos y Aduanas Nacionales)"
          },
          "#": note.id
        },
        "cbc:UUID": {
          "@": {
            "schemeAgencyID": 195,
            "schemeAgencyName": "CO, DIAN (Direccion de Impuestos y Aduanas Nacionales)"
          },
          "#": ""
        },
        "cbc:Note": note.concepto.replace(new RegExp('Ń', 'g'), 'Ñ'),
        "cbc:CreditedQuantity": {
          "@": {
            "unitCode": "NIU"
          },
          "#": note.invoicedquantity
        },
        "cbc:LineExtensionAmount": {
          "@": {
            "currencyID": "COP"
          },
          "#": note.lineextensionamount
        },
        "cac:Item": {
          "cbc:Description": note.description.replace(new RegExp('Ń', 'g'), 'Ñ'),
          "cac:ManufacturersItemIdentification": {
            "cbc:ID": note.servicio
          },
          "cac:AdditionalItemProperty": {
            "cbc:Name": "Total Grupo",
            "cbc:Value": note.totalconcepto
          }
        },
        "cac:Price": {
          "cbc:PriceAmount": {
            "@": {
              "currencyID": "COP"
            },
            "#": note.priceamount
          }
        }
      });
    } else {
      return cb({
        "cbc:ID": {
          "@": {
            "schemeAgencyID": 195,
            "schemeAgencyName": "CO, DIAN (Direccion de Impuestos y Aduanas Nacionales)"
          },
          "#": note.id
        },
        "cbc:UUID": {
          "@": {
            "schemeAgencyID": 195,
            "schemeAgencyName": "CO, DIAN (Direccion de Impuestos y Aduanas Nacionales)"
          },
          "#": ""
        },
        "cbc:Note": note.concepto.replace(new RegExp('Ń', 'g'), 'Ñ'),
        "cbc:DebitedQuantity": {
          "@": {
            "unitCode": "NIU"
          },
          "#": note.invoicedquantity
        },
        "cbc:LineExtensionAmount": {
          "@": {
            "currencyID": "COP"
          },
          "#": note.lineextensionamount
        },
        "cac:Item": {
          "cbc:Description": note.description.replace(new RegExp('Ń', 'g'), 'Ñ'),
          "cac:ManufacturersItemIdentification": {
            "cbc:ID": note.servicio
          },
          "cac:AdditionalItemProperty": {
            "cbc:Name": "Total Grupo",
            "cbc:Value": note.totalconcepto
          }
        },
        "cac:Price": {
          "cbc:PriceAmount": {
            "@": {
              "currencyID": "COP"
            },
            "#": note.priceamount
          }
        }
      });
    }
  }
}