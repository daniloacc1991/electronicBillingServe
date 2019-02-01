export interface InvoiceBody {
  id: number;
  concepto: string;
  servicio?: string;
  description?: string;
  invoicedquantity: number;
  lineextensionamount: number;
  priceamount: number;
  totalconcepto?: number;
}