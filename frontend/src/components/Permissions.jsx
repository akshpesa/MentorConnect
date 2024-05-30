import React, { useState, useEffect } from 'react';
import { Button, Container, CircularProgress, Typography } from '@mui/material';
import Layout from '../components/Layout';
import PermissionForm from './PermissionForm';
import PermissionsList from './PermissionsList';
import { getPermissionsByMentor } from '../api';
import { useAuth } from '../AuthContext';
import { useMentee } from '../MenteeContext';
import { useParams } from 'react-router-dom';
const Permissions = () => {
    // const {id}=useParams();
    const { userRole } = useAuth();
  const { menteeId } = useMentee();
  const [permissions, setPermissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    const fetchPermissions = async () => {
      try {
        const fetchedPermissions = await getPermissionsByMentor(menteeId);
        setPermissions(fetchedPermissions);
      } catch (error) {
        console.error('Error fetching permissions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPermissions();
  }, [menteeId]);

  const handlePermissionAdded = (newPermission) => {
    setPermissions([...permissions, newPermission]);
  };

  const handleStatusChange = (updatedPermission) => {
    setPermissions(permissions.map((perm) => (perm._id === updatedPermission._id ? updatedPermission : perm)));
  };

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <Layout>
      <Container>
        <Typography variant="h4" component="h1" gutterBottom>
          Permission Requests
        </Typography>
        {userRole === 'mentee' && (
          <Button variant="contained" color="primary" onClick={() => setOpenModal(true)}>
            Request Permission
          </Button>
        )}
        <PermissionForm open={openModal} onClose={() => setOpenModal(false)} onPermissionAdded={handlePermissionAdded} />
        <PermissionsList permissions={permissions} onStatusChange={handleStatusChange} />
      </Container>
    </Layout>
  );
};

export default Permissions;
