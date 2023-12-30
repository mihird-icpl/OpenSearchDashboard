import React, { useState } from 'react';

type Group = {
    id: number;
    name: string;
    agents: number;
    configChecksum: string;
    blockUsbStorage: boolean;
    bitLocker: boolean;
};


const GroupManager: React.FC = () => {
    const [groups, setGroups] = useState<Group[]>([
        { id: 1, name: 'Group 1', agents: 10, configChecksum: 'abcd1234',blockUsbStorage: true, bitLocker:false },
        { id: 2, name: 'Group 2', agents: 5, configChecksum: 'efgh5678', blockUsbStorage:false, bitLocker:true }
    ]);
    const [currentGroup, setCurrentGroup] = useState<Group>({ id: 0, name: '', agents: 0, configChecksum: '', blockUsbStorage: true, bitLocker: true });
    const [showModal, setShowModal] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;

        setCurrentGroup({
            ...currentGroup,
            [name]: value
        });
    };

    const saveGroup = () => {
        if (isEditMode) {
            setGroups(groups.map(group => (group.id === currentGroup.id ? currentGroup : group)));
        } else {
            setGroups([...groups, { ...currentGroup, id: groups.length + 1 }]);
        }
        closeModal();
    };

    const editGroup = (group: Group) => {
        setCurrentGroup(group);
        setIsEditMode(true);
        setShowModal(true);
    };

    const deleteGroup = (id: number) => {
        setGroups(groups.filter(group => group.id !== id));
    };

    const closeModal = () => {
        setCurrentGroup({ id: 0, name: '', agents: 0, configChecksum: '', blockUsbStorage: true, bitLocker: true });
        setIsEditMode(false);
        setShowModal(false);
    };

    return (
        <div className="container mt-4">
            <button className="btn btn-primary mb-3" onClick={() => setShowModal(true)}>Add Group</button>
            <table className="table">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Agents</th>
                        <th>Configuration Checksum</th>
                        <th>Block USB Storge</th>
                        <th>Bit Locker</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {groups.map(group => (
                        <tr key={group.id}>
                            <td>{group.name}</td>
                            <td>{group.agents}</td>
                            <td>{group.configChecksum}</td>
                            <td>{group.blockUsbStorage? 'True':'False'}</td>
                            <td>{group.bitLocker? 'True':'False'}</td>
                            <td>
                                <button className="btn btn-primary btn-sm mr-2" onClick={() => editGroup(group)}>Edit</button>
                                <button className="btn btn-danger btn-sm" onClick={() => deleteGroup(group.id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {showModal && (
                <div className="modal d-block">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">{isEditMode ? 'Edit Group' : 'Add Group'}</h5>
                                <button type="button" className="close" onClick={closeModal}>
                                    <span>&times;</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                <div className="form-group">
                                    <label>Name</label>
                                    <input type="text" className="form-control" name="name" value={currentGroup.name} onChange={handleInputChange} />
                                </div>
                                <div className="form-group">
                                    <label>Agents</label>
                                    <input type="number" className="form-control" name="agents" value={currentGroup.agents.toString()} onChange={handleInputChange} />
                                </div>
                                <div className="form-group">
                                    <label>Configuration Checksum</label>
                                    <input type="text" className="form-control" name="configChecksum" value={currentGroup.configChecksum} onChange={handleInputChange} />
                                </div>                                
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={closeModal}>Close</button>
                                <button type="button" className="btn btn-primary" onClick={saveGroup}>Save Group</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default GroupManager;
