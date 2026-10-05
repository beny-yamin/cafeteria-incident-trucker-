import React from 'react';

export const Table = ({ children, className = '', style = {}, ...props }) => {
  return (
    <div
      style={{
        width: '100%',
        overflowX: 'auto',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--border-subtle)',
        backgroundColor: 'rgba(13, 18, 31, 0.5)'
      }}
    >
      <table
        className={className}
        style={{
          width: '100%',
          borderCollapse: 'collapse',
          textAlign: 'left',
          fontSize: '0.875rem',
          ...style
        }}
        {...props}
      >
        {children}
      </table>
    </div>
  );
};

export const TableHeader = ({ children, style = {}, ...props }) => {
  return (
    <thead
      style={{
        borderBottom: '1px solid var(--border-light)',
        backgroundColor: 'rgba(19, 26, 43, 0.85)',
        ...style
      }}
      {...props}
    >
      {children}
    </thead>
  );
};

export const TableBody = ({ children, ...props }) => {
  return <tbody {...props}>{children}</tbody>;
};

export const TableRow = ({ children, isClickable = false, onClick, style = {}, ...props }) => {
  return (
    <tr
      onClick={onClick}
      style={{
        borderBottom: '1px solid var(--border-subtle)',
        transition: 'background-color 0.15s ease',
        cursor: isClickable ? 'pointer' : 'default',
        ...style
      }}
      onMouseEnter={(e) => {
        if (isClickable) e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.03)';
      }}
      onMouseLeave={(e) => {
        if (isClickable) e.currentTarget.style.backgroundColor = 'transparent';
      }}
      {...props}
    >
      {children}
    </tr>
  );
};

export const TableHead = ({ children, style = {}, ...props }) => {
  return (
    <th
      style={{
        padding: '0.85rem 1rem',
        fontWeight: 700,
        fontSize: '0.75rem',
        letterSpacing: '0.04em',
        textTransform: 'uppercase',
        color: 'var(--text-muted)',
        ...style
      }}
      {...props}
    >
      {children}
    </th>
  );
};

export const TableCell = ({ children, style = {}, ...props }) => {
  return (
    <td
      style={{
        padding: '0.85rem 1rem',
        color: 'var(--text-main)',
        verticalAlign: 'middle',
        ...style
      }}
      {...props}
    >
      {children}
    </td>
  );
};

export default Table;
