import { LEGAL_ENTITY, PRIVACY_PATH } from '../config/legalConfig'
import LegalLayout, { type LegalSection } from './LegalLayout'

const SECTIONS: LegalSection[] = [
  {
    title: 'Responsable del tratamiento',
    body: (
      <>
        {LEGAL_ENTITY.razonSocial} (nombre comercial {LEGAL_ENTITY.nombreComercial}), RFC {LEGAL_ENTITY.rfc},
        con domicilio en {LEGAL_ENTITY.domicilio}, es responsable del tratamiento de tus datos personales
        conforme a la Ley Federal de Protección de Datos Personales en Posesión de los Particulares.
      </>
    ),
  },
  {
    title: 'Datos que recabamos',
    body: 'Nombre, correo electrónico, teléfono o WhatsApp (opcional), nombres de los integrantes de tu equipo, categoría y detalles de tu compra, y datos técnicos de navegación (origen de la visita y eventos de uso del sitio). No recabamos ni almacenamos datos de tarjetas: los captura directamente la pasarela de pago. No solicitamos datos personales sensibles.',
  },
  {
    title: 'Finalidades',
    body: (
      <>
        Necesarias: procesar tu inscripción o compra, confirmar el pago, enviarte tu boleto y comunicaciones
        operativas del evento, y brindarte soporte. Adicionales, solo si las aceptas: enviarte noticias,
        ajustes y avisos de próximos eventos; y análisis estadístico del uso del sitio.
      </>
    ),
  },
  {
    title: 'Transferencias y encargados',
    body: 'Para procesar tu pago compartimos los datos estrictamente necesarios con las pasarelas Openpay y Mercado Pago, y utilizamos proveedores de infraestructura, correo y analítica que tratan datos por nuestra cuenta. No vendemos tus datos. Podremos divulgarlos cuando una autoridad competente lo requiera.',
  },
  {
    title: 'Derechos ARCO y revocación',
    body: (
      <>
        Puedes ejercer tus derechos de acceso, rectificación, cancelación y oposición, así como revocar tu
        consentimiento o limitar el uso de tus datos, escribiendo a {LEGAL_ENTITY.supportEmail} con tu nombre,
        medio para responderte y descripción de tu solicitud. Responderemos en los plazos que marca la ley.
      </>
    ),
  },
  {
    title: 'Cookies y tecnologías similares',
    body: 'Usamos almacenamiento local y herramientas de analítica para recordar tu compra en curso, medir el desempeño del sitio y la atribución de campañas. Puedes limitarlas desde la configuración de tu navegador.',
  },
  {
    title: 'Cambios a este aviso',
    body: 'Cualquier modificación se publicará en esta página, con su fecha de actualización.',
  },
]

export default function PrivacyPage() {
  return (
    <LegalLayout
      title="Aviso de Privacidad"
      description="Aviso de privacidad de HYBRID EXPERIENCE 2026: responsable, datos, finalidades y derechos ARCO."
      path={PRIVACY_PATH}
      sections={SECTIONS}
    />
  )
}
