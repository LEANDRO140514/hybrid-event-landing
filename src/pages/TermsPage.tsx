import { LEGAL_ENTITY, TERMS_PATH } from '../config/legalConfig'
import LegalLayout, { type LegalSection } from './LegalLayout'

const SECTIONS: LegalSection[] = [
  {
    title: 'Quién ofrece este servicio',
    body: (
      <>
        HYBRID EXPERIENCE 2026, producido bajo la marca ENFORMA®, es operado por {LEGAL_ENTITY.razonSocial}{' '}
        (RFC {LEGAL_ENTITY.rfc}), con domicilio en {LEGAL_ENTITY.domicilio}. Al comprar una inscripción o un
        pase de público aceptas estos Términos y Condiciones.
      </>
    ),
  },
  {
    title: 'Productos',
    body: 'Se venden inscripciones de competencia (Individual, Dobles, Relay, ½ Hybrid) y pases de público. Los precios están en pesos mexicanos (MXN) e incluyen lo descrito en la sección de preguntas frecuentes. El precio válido es el que se muestra al momento de confirmar la compra.',
  },
  {
    title: 'Pagos y pasarelas',
    body: (
      <>
        Las transacciones serán efectuadas mediante la pasarela de Openpay. Como alternativa, también
        puedes pagar con Mercado Pago. Los datos de tu tarjeta los captura directamente la pasarela que
        elijas; nosotros no los recibimos ni los almacenamos. Al pagar aceptas además los términos de la
        pasarela utilizada.
      </>
    ),
  },
  {
    title: 'Confirmación de compra',
    body: 'Tu lugar queda confirmado cuando la pasarela notifica el pago como aprobado y nuestro sistema lo verifica. Recibirás tu confirmación por correo electrónico; revisa también la carpeta de spam. Si tu pago queda pendiente, el lugar no está asegurado hasta que se apruebe.',
  },
  {
    title: 'Datos de los participantes',
    body: 'Eres responsable de que el nombre, correo y datos de contacto proporcionados (incluidos los de tus compañeros de equipo) sean correctos. Los accesos son personales e intransferibles salvo que el organizador autorice un cambio por escrito.',
  },
  {
    title: 'Cancelaciones, cambios y reembolsos',
    body: (
      <>
        Para solicitar una aclaración, cambio o reembolso escribe a {LEGAL_ENTITY.supportEmail} indicando tu
        referencia de compra. Las solicitudes se evalúan de acuerdo con la normatividad aplicable y con las
        condiciones vigentes de cada categoría. Si el organizador cancela el evento, se reembolsará el
        importe pagado por el mismo medio de pago.
      </>
    ),
  },
  {
    title: 'Riesgos y condición física',
    body: 'La participación implica esfuerzo físico intenso. Declaras estar en condiciones de salud aptas y aceptas las reglas del evento y las indicaciones del personal. El organizador puede negar la participación a quien incumpla las reglas o ponga en riesgo la seguridad.',
  },
  {
    title: 'Propiedad intelectual',
    body: 'HYBRID EVENT EXPERIENCE se opera bajo la marca ENFORMA® y no guarda relación comercial, afiliación ni patrocinio con Upsolut Sports GmbH ni con la marca HYROX®. Los contenidos de este sitio no pueden usarse sin autorización.',
  },
  {
    title: 'Privacidad',
    body: 'El tratamiento de tus datos personales se rige por nuestro Aviso de Privacidad, disponible en este sitio.',
  },
  {
    title: 'Contacto, ley aplicable y jurisdicción',
    body: (
      <>
        Soporte: {LEGAL_ENTITY.supportEmail}. Estos términos se rigen por las leyes de los Estados Unidos
        Mexicanos; para su interpretación las partes se someten a los tribunales competentes de Mérida,
        Yucatán, sin perjuicio de los derechos que la Ley Federal de Protección al Consumidor otorga al
        consumidor.
      </>
    ),
  },
]

export default function TermsPage() {
  return (
    <LegalLayout
      title="Términos y Condiciones"
      description="Términos y condiciones de compra de HYBRID EXPERIENCE 2026. Pagos procesados mediante Openpay."
      path={TERMS_PATH}
      sections={SECTIONS}
    />
  )
}
