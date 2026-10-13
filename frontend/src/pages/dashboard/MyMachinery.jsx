import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { equipmentService } from '../../services/equipmentService';
import { useNotifications } from '../../context/NotificationContext';
import { EquipmentGrid } from '../../components/equipment/EquipmentGrid';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { PlusCircle, Tractor, Sparkles } from 'lucide-react';

export const MyMachinery = () => {
  const { addToast } = useNotifications();
  const navigate = useNavigate();

  const [myEquipment, setMyEquipment] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchMyEquipment = async () => {
    try {
      setLoading(true);
      const res = await equipmentService.getMyEquipment();
      if (res.success) {
        setMyEquipment(res.equipment || []);
      }
    } catch (err) {
      addToast(err.message || 'Failed to fetch machinery', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyEquipment();
  }, []);

  const handleEdit = (eq) => {
    navigate(`/dashboard/machinery/${eq._id}/edit`);
  };

  const handleDeletePrompt = (eq) => {
    setDeleteTarget(eq);
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      const res = await equipmentService.delete(deleteTarget._id);
      if (res.success) {
        addToast('Equipment deleted successfully!', 'success');
        setMyEquipment((prev) => prev.filter((item) => item._id !== deleteTarget._id));
        setDeleteTarget(null);
      }
    } catch (err) {
      addToast(err.message || 'Failed to delete equipment', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  if (loading) {
    return <LoadingSpinner fullPage message="Fetching your machinery inventory..." />;
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
          marginBottom: '2rem'
        }}
      >
        <div>
          <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Equipment Inventory
          </span>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, marginTop: '0.2rem' }}>
            My Agricultural Machinery ({myEquipment.length})
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.925rem' }}>
            Manage listings, adjust rental pricing, and view machinery availability
          </p>
        </div>

        {myEquipment.length > 0 && (
          <Link to="/dashboard/machinery/add" className="btn btn-primary">
            <PlusCircle size={18} /> + Add Another Equipment
          </Link>
        )}
      </div>

      {/* Grid or Empty State (Section 11) */}
      <EquipmentGrid
        equipment={myEquipment}
        loading={false}
        isOwnerView={true}
        onEdit={handleEdit}
        onDelete={handleDeletePrompt}
        emptyTitle="No equipment added yet"
        emptyDescription="Start earning by sharing your agricultural machinery with farmers around you."
        emptyActionText="Add Your Equipment"
        emptyActionLink="/dashboard/machinery/add"
      />

      {/* Delete Confirmation Modal (Section 39) */}
      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Equipment?"
        message={`Are you sure you want to delete "${deleteTarget?.equipmentName}"? This action cannot be undone.`}
        confirmText="Delete Equipment"
        cancelText="Cancel"
        isDanger={true}
        isLoading={isDeleting}
      />
    </div>
  );
};
