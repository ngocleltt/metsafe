import React, { useEffect, useMemo, useState } from 'react';
import {
  Search,
  Users,
  UserPlus,
  MoreVertical
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import '../../components/styles/AdminEmployees.css';

const AdminEmployees = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    let mounted = true;

    const loadEmployees = async () => {
      setLoading(true);
      setError('');

      const {
        data,
        error: queryError
      } = await supabase
        .from('employees')
        .select(`
          id,
          employee_code,
          full_name,
          email,
          phone,
          position_text,
          experience_years,
          is_active,
          created_at
        `)
        .order('full_name', {
          ascending: true
        });

      if (!mounted) {
        return;
      }

      if (queryError) {
        console.error(
          'Load employees error:',
          queryError
        );
        setError(
          queryError.message ||
            'Unable to load employees.'
        );
        setEmployees([]);
      } else {
        setEmployees(data || []);
      }

      setLoading(false);
    };

    loadEmployees();

    return () => {
      mounted = false;
    };
  }, []);

  const filteredEmployees = useMemo(() => {
    const normalizedSearch =
      searchTerm.trim().toLowerCase();

    return employees.filter((employee) => {
      const matchesSearch =
        !normalizedSearch ||
        employee.full_name
          ?.toLowerCase()
          .includes(normalizedSearch) ||
        employee.employee_code
          ?.toLowerCase()
          .includes(normalizedSearch) ||
        employee.email
          ?.toLowerCase()
          .includes(normalizedSearch) ||
        employee.position_text
          ?.toLowerCase()
          .includes(normalizedSearch);

      const matchesStatus =
        statusFilter === 'all' ||
        (statusFilter === 'active' &&
          employee.is_active) ||
        (statusFilter === 'inactive' &&
          !employee.is_active);

      return matchesSearch && matchesStatus;
    });
  }, [employees, searchTerm, statusFilter]);

  const activeCount = employees.filter(
    (employee) => employee.is_active
  ).length;

  const inactiveCount = employees.length - activeCount;

  return (
    <div className="admin-employees-page">
      <div className="admin-employees-header">
        <div>
          <span className="admin-page-eyebrow">
            Administration
          </span>

          <h1>Employees</h1>

          <p>
            Manage employee records and workplace
            information.
          </p>
        </div>

        <button
          type="button"
          className="admin-primary-button"
          onClick={() => {
            // Add employee modal will be added later.
          }}
        >
          <UserPlus size={17} />
          Add employee
        </button>
      </div>

      <div className="employee-stat-grid">
        <div className="employee-stat-card">
          <div className="employee-stat-icon">
            <Users size={20} />
          </div>

          <div>
            <span>Total employees</span>
            <strong>{employees.length}</strong>
          </div>
        </div>

        <div className="employee-stat-card">
          <div className="employee-stat-icon is-active">
            <Users size={20} />
          </div>

          <div>
            <span>Active employees</span>
            <strong>{activeCount}</strong>
          </div>
        </div>

        <div className="employee-stat-card">
          <div className="employee-stat-icon is-inactive">
            <Users size={20} />
          </div>

          <div>
            <span>Inactive employees</span>
            <strong>{inactiveCount}</strong>
          </div>
        </div>
      </div>

      <section className="employee-table-card">
        <div className="employee-toolbar">
          <div className="employee-search-box">
            <Search size={18} />

            <input
              type="search"
              value={searchTerm}
              onChange={(event) =>
                setSearchTerm(event.target.value)
              }
              placeholder="Search employees..."
            />
          </div>

          <select
            value={statusFilter}
            onChange={(event) =>
              setStatusFilter(event.target.value)
            }
            className="employee-status-filter"
          >
            <option value="all">All statuses</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        {error && (
          <div
            className="admin-page-error"
            role="alert"
          >
            {error}
          </div>
        )}

        {loading ? (
          <div className="employee-empty-state">
            Loading employees...
          </div>
        ) : filteredEmployees.length === 0 ? (
          <div className="employee-empty-state">
            <Users size={30} />
            <h3>No employees found</h3>
            <p>
              Try changing your search or filter.
            </p>
          </div>
        ) : (
          <div className="employee-table-wrapper">
            <table className="employee-table">
              <thead>
                <tr>
                  <th>Employee</th>
                  <th>Position</th>
                  <th>Experience</th>
                  <th>Status</th>
                  <th aria-label="Actions" />
                </tr>
              </thead>

              <tbody>
                {filteredEmployees.map((employee) => (
                  <tr key={employee.id}>
                    <td>
                      <div className="employee-identity">
                        <div className="employee-avatar">
                          {employee.full_name
                            ?.charAt(0)
                            .toUpperCase() || 'E'}
                        </div>

                        <div>
                          <strong>
                            {employee.full_name ||
                              'Unnamed employee'}
                          </strong>

                          <span>
                            {employee.employee_code ||
                              employee.email ||
                              'No code'}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td>
                      {employee.position_text || '—'}
                    </td>

                    <td>
                      {employee.experience_years ?? '—'}
                      {employee.experience_years !== null &&
                        employee.experience_years !==
                          undefined &&
                        ' years'}
                    </td>

                    <td>
                      <span
                        className={`employee-status ${
                          employee.is_active
                            ? 'is-active'
                            : 'is-inactive'
                        }`}
                      >
                        {employee.is_active
                          ? 'Active'
                          : 'Inactive'}
                      </span>
                    </td>

                    <td>
                      <button
                        type="button"
                        className="employee-action-button"
                        aria-label={`Actions for ${
                          employee.full_name
                        }`}
                        onClick={() => {
                          // Edit/details menu will be added later.
                        }}
                      >
                        <MoreVertical size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
};

export default AdminEmployees;