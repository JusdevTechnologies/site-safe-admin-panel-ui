/**
 * Card Component
 * Reusable card container
 */
function Card({ 
  children, 
  className = '',
  title,
  subtitle,
  footer,
  hoverable = false,
  ...props 
}) {
  const cardClass = `
    bg-white rounded-lg border border-gray-200 shadow-sm 
    ${hoverable ? 'hover:shadow-md transition-shadow' : ''}
    ${className}
  `;

  return (
    <div className={cardClass} {...props}>
      {(title || subtitle) && (
        <div className="px-6 py-4 border-b border-gray-100">
          {title && <h3 className="text-lg font-semibold text-gray-900">{title}</h3>}
          {subtitle && <p className="text-sm text-gray-600">{subtitle}</p>}
        </div>
      )}

      <div className="p-6">
        {children}
      </div>

      {footer && (
        <div className="px-6 py-4 border-t border-gray-100">
          {footer}
        </div>
      )}
    </div>
  );
}

export default Card;
