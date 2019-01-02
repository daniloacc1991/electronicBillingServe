export class XmlAdmin {

  constructor () {
  }
  // tslint:disable:quotemark
  headerXML (encabezado): any {
    const invoce = {
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
                "sts:InvoiceAuthorization": encabezado[0].invoiceauthorization,
                "sts:AuthorizationPeriod": {
                  "cbc:StartDate": encabezado[0].startdate,
                  "cbc:EndDate": encabezado[0].enddate
                },
                "sts:AuthorizedInvoices": {
                  "sts:Prefix": encabezado[0].prefix,
                  "sts:From": encabezado[0].rfrom,
                  "sts:To": encabezado[0].rto
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
      "cbc:ID": encabezado[0].prefix + encabezado[0].invoice,
      "cbc:UUID": {
        "@": {
          "schemeAgencyID": "195",
          "schemeAgencyName": "CO, DIAN (Direccion de Impuestos y Aduanas Nacionales)"
        },
        "#": ""
      },
      "cbc:IssueDate": encabezado[0].issuedate,
      "cbc:IssueTime": encabezado[0].issuetime,
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
          "#": encabezado[0].datein
        },
        {
          "#": encabezado[0].dateout
        },
        {
          "#": encabezado[0].observation
        },
        {
          "#": encabezado[0].producedby
        },
        {
          "#": encabezado[0].printdate
        },
        {
          "#": encabezado[0].register
        },
        {
          "#": encabezado[0].totaldiscount
        },
        {
          "#": encabezado[0].codediscount
        }
      ],
      "cbc:DocumentCurrencyCode": "COP",
      "cac:BillingReference": {
        "cac:InvoiceDocumentReference": {
          "cbc:ID": encabezado[0].typeinvoce
        }
      },
      "cac:ContractDocumentReference": {
        "cbc:ID": encabezado[0].contract
      },
      "cac:AdditionalDocumentReference": {
        "cbc:ID": encabezado[0].register,
        "cbc:DocumentType": encabezado[0].identificationpatient
      },
      "fe:AccountingSupplierParty": {
        "cbc:AdditionalAccountID": encabezado[0].companyaccountid,
        "fe:Party": {
          "cac:PartyIdentification": {
            "cbc:ID": {
              "@": {
                "schemeAgencyID": "195",
                "schemeAgencyName": "CO, DIAN (Direccion de Impuestos y Aduanas Nacionales)",
                "schemeID": encabezado[0].companytypedocument
              },
              "#": encabezado[0].companydocument
            }
          },
          "cac:PartyName": {
            "cbc:Name": encabezado[0].companyname
          },
          "fe:PhysicalLocation": {
            "fe:Address": {
              "cbc:Department": encabezado[0].companydepartment,
              "cbc:CityName": encabezado[0].companycity,
              "cac:AddressLine": {
                "cbc:Line": encabezado[0].companyaddress
              },
              "cac:Country": {
                "cbc:IdentificationCode": "CO"
              }
            }
          },
          "fe:PartyTaxScheme": {
            "cbc:TaxLevelCode": encabezado[0].companyregimen,
            "cac:TaxScheme": ""
          },
          "fe:PartyLegalEntity": {
            "cbc:RegistrationName": encabezado[0].companyname
          },
          "cac:Contact": {
            "cbc:Telephone": encabezado[0].companytelephone
          }
        }
      },
      "fe:AccountingCustomerParty": {
        "cbc:AdditionalAccountID": encabezado[0].clientaccountid,
        "fe:Party": {
          "cac:PartyIdentification": {
            "cbc:ID": {
              "@": {
                "schemeAgencyID": "195",
                "schemeAgencyName": "CO, DIAN (Direccion de Impuestos y Aduanas Nacionales)",
                "schemeID": encabezado[0].clienttypedocument
              },
              "#": encabezado[0].clientdocument
            }
          },
          "fe:PhysicalLocation": {
            "fe:Address": {
              "cbc:Department": encabezado[0].clientdepartment,
              "cbc:CityName": encabezado[0].clientcity,
              "cac:AddressLine": {
                "cbc:Line": encabezado[0].clientaddress.toLocaleUpperCase()
              },
              "cac:Country": {
                "cbc:IdentificationCode": "CO"
              }
            }
          },
          "fe:PartyTaxScheme": {
            "cbc:TaxLevelCode": encabezado[0].clientregimen,
            "cac:TaxScheme": ""
          },
          "fe:PartyLegalEntity": {
            "cbc:RegistrationName": encabezado[0].clientname
          },
          "cac:Contact": {
            "cbc:Telephone": encabezado[0].clienttelephone,
            "cbc:ElectronicMail": encabezado[0].clientemail,
            "cbc:Note" : encabezado[0].plan
          },
          "fe:Person": {
            "cbc:FirstName": encabezado[0].clientaccountid === 2 ? encabezado[0].firstname : "CLIENTE",
            "cbc:FamilyName": encabezado[0].clientaccountid === 2 ? encabezado[0].familyname : "",
            "cbc:MiddleName": encabezado[0].clientaccountid === 2 ? encabezado[0].middlename : ""
          }
        }
      },
      "cac:PaymentMeans": {
        "cbc:PaymentMeansCode": "41",
        "cbc:PaymentDueDate": encabezado[0].paymentduedate
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
          "#": encabezado[0].subtotal
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
          "#": encabezado[0].totaldiscount
        },
        "cbc:PayableAmount": {
          "@": {
            "currencyID": "COP"
          },
          "#": encabezado[0].total
        }
      },
      "fe:InvoiceLine": encabezado[0].details
    };
    return invoce;
  }

  detailsXML (detalle, typeInvoce) {
    let details;
    if (typeInvoce === "R") {
      details = {
        "cbc:ID": detalle.id,
        "cbc:InvoicedQuantity": detalle.invoicedquantity,
        "cbc:LineExtensionAmount": {
          "@": {
            "currencyID": "COP"
          },
          "#": detalle.lineextensionamount
        },
        "fe:Item": {
          "cbc:Description": detalle.description
        },
        "fe:Price": {
          "cbc:PriceAmount": {
            "@": {
              "currencyID": "COP"
            },
            "#": detalle.priceamount
          }
        }
      };
    } else if (typeInvoce === "D") {
      details = {
        "cbc:ID": detalle.id,
        "cbc:Note": detalle.concepto,
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
      };
    } else if (typeInvoce === "P") {
      details = {
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
      };
    }
    return details;
  }

  headerNote (nota: any, cb) {
    return cb({
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
                  "sts:Prefix": nota.prefix,
                  "sts:From": nota.from,
                  "sts:To": nota.to
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
      "cbc:UBLVersionID" : "UBL 2.0",
      "cbc:ProfileID" : "DIAN 1.0",
      "cbc:ID" : nota.note,
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
          "#": nota.producedby
        },
        {
          "#": nota.printdate
        },
        {
          "#": nota.cufe
        },
        {
          "#": nota.description.replace('Ń', 'Ñ')
        }
      ],
      "cbc:DocumentCurrencyCode": "COP",
      "cac:BillingReference": {
        "cac:InvoiceDocumentReference": {
          "cbc:ID": nota.invoice,
          "cbc:UUID": nota.cufe,
          "cbc:IssueDate": nota.invoice_issuedate
        }
      },
      "cac:AdditionalDocumentReference": {
        "cbc:ID": nota.description.replace('Ń', 'Ñ'),
        "cbc:DocumentType": nota.document_paciente
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
            "cbc:RegistrationName": nota.clientname
          },
          "cac:Contact": {
            "cbc:Telephone": nota.clienttelephone,
            "cbc:ElectronicMail": nota.clientemail,
            "cbc:Note": nota.plan
          },
          "fe:Person": {
            "cbc:FirstName": nota.clientid === 2 ? nota.firstname : "CLIENTE",
            "cbc:FamilyName": nota.clientid === 2 ? nota.familyname : "",
            "cbc:MiddleName": nota.clientid === 2 ? nota.middlename : ""
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
          "#": nota.subtotal ? nota.subtotal : 0
        },
        "cbc:TaxExclusiveAmount": {
          "@": {
            "currencyID": "COP"
          },
          "#": nota.taxestotal ? nota.taxestotal : 0
        },
        "cbc:AllowanceTotalAmount": {
          "@": {
            "currencyID": "COP"
          },
          "#": nota.discountstotal ? nota.discountstotal : 0
        },
        "cbc:PayableAmount": {
          "@": {
            "currencyID": "COP"
          },
          "#": nota.paytotal ? nota.paytotal : 0
        }
      }
    });
  }

  bodyNote (note: any, cb) {
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
      "cbc:Note": note.concept,
      "cbc:DebitedQuantity": note.debitedquantity,
      "cbc:LineExtensionAmount": {
        "@": {
          "currencyID": "COP"
        },
        "#": note.lineextensionamount
      },
      "cac:Item": {
        "cbc:Description": note.description,
        "cac:ManufacturersItemIdentification": {
          "cbc:ID": note.codreference
        },
        "cac:AdditionalItemProperty": {
          "cbc:Name": "Total Grupo",
          "cbc:Value": note.totalgroup
        },
        "cac:Price": {
          "cbc:PriceAmount": {
            "@": {
              "currencyID": "COP"
            },
            "#": note.priceamount
          }
        }
      }
    });
  }
}