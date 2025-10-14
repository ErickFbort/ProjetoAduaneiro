import React, { useState, useEffect } from 'react';
import { UserProfile, UserProfileUpdate } from '../../types/user';
import './UserProfileCard.css';

interface UserProfileCardProps {
  user: UserProfile;
  onUpdate?: (updates: UserProfileUpdate) => void;
  className?: string;
}

const UserProfileCard: React.FC<UserProfileCardProps> = ({
  user,
  onUpdate,
  className = ''
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [jobTitle, setJobTitle] = useState(user.jobTitle || '');
  const [department, setDepartment] = useState(user.department || '');
  // Estados de upload removidos - upload apenas via modal

  // Atualizar estado local quando user prop mudar
  useEffect(() => {
    setJobTitle(user.jobTitle || '');
    setDepartment(user.department || '');
  }, [user]);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveClick = () => {
    const updates: UserProfileUpdate = {
      jobTitle: jobTitle.trim(),
      department: department.trim()
    };

    onUpdate?.(updates);
    setIsEditing(false);
  };

  const handleCancelClick = () => {
    setJobTitle(user.jobTitle || '');
    setDepartment(user.department || '');
    setIsEditing(false);
  };

  const handleAvatarClick = () => {
    // Removido - avatar não deve abrir seletor de arquivos diretamente
    // Apenas abrir o modal
    handleCardClick();
  };

  const handleCardClick = () => {
    // Abrir modal de perfil se disponível
    if (typeof window !== 'undefined' && (window as any).openUserProfileModal) {
      (window as any).openUserProfileModal();
    }
  };

  // Função removida - upload apenas via modal

  // Função de upload removida - upload apenas via modal

  const formatLastLogin = (lastLogin?: string) => {
    if (!lastLogin) return 'Nunca';
    
    const date = new Date(lastLogin);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Agora mesmo';
    if (diffInHours < 24) return `Há ${diffInHours}h`;
    if (diffInHours < 48) return 'Ontem';
    
    return date.toLocaleDateString('pt-BR');
  };

  return (
    <div className={`user-profile-card ${className}`} onClick={handleCardClick}>
      <div className="user-profile-avatar" onClick={(e) => { e.stopPropagation(); handleAvatarClick(); }}>
        <img 
          src={user.avatar || '/static/img/user-avatar-placeholder.svg'} 
          alt="Foto do usuário" 
          className="profile-avatar"
        />
        {/* Overlay de câmera removido - upload apenas via modal */}
        {/* Input de arquivo removido - upload apenas via modal */}
      </div>

      <div className="user-profile-info">
        <h4 className="user-name">{user.name}</h4>
        
        {isEditing ? (
          <div className="user-edit-form">
            <div className="form-group">
              <label htmlFor="job-title-input">Cargo:</label>
              <input
                id="job-title-input"
                type="text"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                placeholder="Digite seu cargo"
                className="form-control"
              />
            </div>
            <div className="form-group">
              <label htmlFor="department-input">Departamento:</label>
              <input
                id="department-input"
                type="text"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                placeholder="Digite seu departamento"
                className="form-control"
              />
            </div>
            <div className="form-actions">
              <button 
                className="btn btn-success btn-sm" 
                onClick={handleSaveClick}
              >
                <i className="fas fa-check"></i> Salvar
              </button>
              <button 
                className="btn btn-secondary btn-sm" 
                onClick={handleCancelClick}
              >
                <i className="fas fa-times"></i> Cancelar
              </button>
            </div>
          </div>
        ) : (
          <div className="user-display-info">
            <p className="user-role">
              {user.jobTitle || 'Cargo não informado'}
            </p>
          </div>
        )}
      </div>

      {/* Preview de upload removido - upload apenas via modal */}
    </div>
  );
};

export default UserProfileCard;
