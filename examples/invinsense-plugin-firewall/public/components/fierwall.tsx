import React, { useState } from 'react';

// Define the type for a firewall rule
type FirewallRule = {
    id: number;
    sourceIp: string;
    destinationIp: string;
    protocol: string;
    port: number;
};

const FirewallManager: React.FC = () => {
    const [firewallRules, setFirewallRules] = useState<FirewallRule[]>([]);
    const [newRule, setNewRule] = useState<FirewallRule>({ id: 0, sourceIp: '', destinationIp: '', protocol: 'TCP', port: 0 });
    const [showModal, setShowModal] = useState(false);

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setNewRule({ ...newRule, [event.target.name]: event.target.value });
    };

    const addRule = () => {
        setFirewallRules([...firewallRules, { ...newRule, id: firewallRules.length + 1 }]);
        setNewRule({ id: 0, sourceIp: '', destinationIp: '', protocol: 'TCP', port: 0 });
        setShowModal(false);
    };

    const deleteRule = (id: number) => {
        setFirewallRules(firewallRules.filter(rule => rule.id !== id));
    };

    return (
        <div className="container mt-4">            
            <div className="mb-3">
                <button className="btn btn-primary" onClick={() => setShowModal(true)}>
                    Add Rule
                </button>
            </div>

            <table className="table">
                <thead>
                    <tr>
                        <th>Rule ID</th>
                        <th>Source IP</th>
                        <th>Destination IP</th>
                        <th>Protocol</th>
                        <th>Port</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {firewallRules.map(rule => (
                        <tr key={rule.id}>
                            <td>{rule.id}</td>
                            <td>{rule.sourceIp}</td>
                            <td>{rule.destinationIp}</td>
                            <td>{rule.protocol}</td>
                            <td>{rule.port}</td>
                            <td>
                                <button className="btn btn-danger btn-sm" onClick={() => deleteRule(rule.id)}>
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {showModal && (
                <div className="modal d-block" style={{top:"50px"}}>
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Add Firewall Rule</h5>
                                <button type="button" className="close" onClick={() => setShowModal(false)}>
                                    <span>&times;</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                <div className="form-group">
                                    <label>Source IP</label>
                                    <input type="text" className="form-control" name="sourceIp" value={newRule.sourceIp} onChange={handleInputChange} />
                                </div>
                                <div className="form-group">
                                    <label>Destination IP</label>
                                    <input type="text" className="form-control" name="destinationIp" value={newRule.destinationIp} onChange={handleInputChange} />
                                </div>
                                <div className="form-group">
                                    <label>Protocol</label>
                                    <select className="form-control" name="protocol" value={newRule.protocol} onChange={handleInputChange}>
                                        <option>TCP</option>
                                        <option>UDP</option>
                                        <option>ICMP</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Port</label>
                                    <input type="number" className="form-control" name="port" value={newRule.port} onChange={handleInputChange} />
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Close</button>
                                <button type="button" className="btn btn-primary" onClick={addRule}>Save Rule</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FirewallManager;
