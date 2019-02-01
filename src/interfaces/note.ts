export interface NoteHeader {
  invoiceauthorization: string;
  startdate: string;
  enddate: string;
  prefix: string;
  rfrom: number;
  rto: number;
  note: number;
  issuedate: string;
  issuetime: string;
  datein: string;
  dateout: string;
  observation: string;
  producedby: string;
  printdate: string;
  contract: string;
  invoice: string;
  cufe: string;
  issuedateinvoice: string;
  register: string;
  identificationpatient: string;
  companyaccountid: number;
  companytypedocument: number;
  companydocument: string;
  companyname: string;
  companydepartment: string;
  companycity: string;
  companyaddress: string;
  companyregimen: number;
  companytelephone: string;
  clientaccountid: number;
  clienttypedocument: number;
  clientdocument: string;
  clientdepartment: string;
  clientcity: string;
  clientaddress: string;
  clientregimen: number;
  clientname: string;
  clienttelephone: string;
  clientemail: string;
  plan: string;
  firstname: string;
  familyname: string;
  middlename: string;
  price: number;
}

export interface NoteBody {
  id: number;
  concepto: string;
  servicio: string;
  description: string;
  invoicedquantity: number;
  lineextensionamount: number;
  priceamount: number;
  totalconcepto: number;
}