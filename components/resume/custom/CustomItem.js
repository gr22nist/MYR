import React from 'react';

const CustomSectionItem = ({ section, onRemove }) => {
  const renderContent = () => {
    switch (section.type) {
      case 'project':
        return (
          <>
            <h3 className="font-bold">{section.title}</h3>
            <p>{section.description}</p>
            <p>{section.period?.startDate} ~ {section.period?.endDate}</p>
          </>
        );
      case 'award':
        return (
          <>
            <h3 className="font-bold">{section.title}</h3>
            <p>{section.organization}</p>
            <p>{section.date?.startDate}</p>
          </>
        );
      case 'certificate':
        return (
          <>
            <h3 className="font-bold">{section.title}</h3>
            <p>{section.issuer}</p>
            <p>{section.date?.startDate}</p>
          </>
        );
      case 'language':
        return (
          <>
            <h3 className="font-bold">{section.language}</h3>
            <p>{section.proficiency}</p>
          </>
        );
      case 'skill':
        return (
          <>
            <h3 className="font-bold">{section.skillName}</h3>
            <p>{section.proficiency}</p>
          </>
        );
      case 'custom':
        return (
          <>
            <h3 className="font-bold">{section.title}</h3>
            <p>{section.content}</p>
          </>
        );
      default:
        return <p>Unknown section type</p>;
    }
  };

  return (
    <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
      {renderContent()}
      <button
        onClick={() => onRemove(section.id)}
        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mt-4"
      >
        삭제
      </button>
    </div>
  );
};

export default CustomSectionItem;
