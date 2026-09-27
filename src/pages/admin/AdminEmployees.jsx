import React, { useEffect, useMemo, useState } from 'react';
import {
  Search,
  Users,
  UserPlus,
  MoreVertical
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import '../../components/styles/AdminEmployees.css';

const AdminEmployees = ({ t }) => {
  const text = t.adminEmployees;

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

      try {
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

        if (queryError) {
          throw queryError;
        }

        if (mounted) {
          setEmployees(data || []);
        }
      } catch (queryError) {
        console.error('Load employees error:', queryError);

        if (mounted) {
          setError(text.loadError);
          setEmployees([]);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadEmployees();

    return () => {
      mounted = false;
    };
  }, [text.loadError]);

  const filteredEmployees = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

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
        (statusFilter === 'active' && employee.is_active) ||
        (statusFilter === 'inactive' && !employee.is_active);

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
            {text.eyebrow}
          </span>

          <h1>{text.title}</h1>

          <p>{text.description}</p>
        </div>

        {/* Chưa có modal thêm nhân viên nên tạm khóa nút */}
        <button
          type="button"
          className="admin-primary-button"
          disabled
        >
          <UserPlus size={17} aria-hidden="true" />
          {text.addEmployee}
        </button>
      </div>

      <div className="employee-stat-grid">
        <div className="employee-stat-card">
          <div className="employee-stat-icon">
            <Users size={20} aria-hidden="true" />
          </div>

          <div>
            <span>{text.totalEmployees}</span>
            <strong>{employees.length}</strong>
          </div>
        </div>

        <div className="employee-stat-card">
          <div className="employee-stat-icon is-active">
            <Users size={20} aria-hidden="true" />
          </div>

          <div>
            <span>{text.activeEmployees}</span>
            <strong>{activeCount}</strong>
          </div>
        </div>

        <div className="employee-stat-card">
          <div className="employee-stat-icon is-inactive">
            <Users size={20} aria-hidden="true" />
          </div>

          <div>
            <span>{text.inactiveEmployees}</span>
            <strong>{inactiveCount}</strong>
          </div>
        </div>
      </div>

      <section className="employee-table-card">
        <div className="employee-toolbar">
          <div className="employee-search-box">
            <Search size={18} aria-hidden="true" />

            <input
              type="search"
              value={searchTerm}
              onChange={(event) =>
                setSearchTerm(event.target.value)
              }
              placeholder={text.searchPlaceholder}
              aria-label={text.searchPlaceholder}
            />
          </div>

          <select
            value={statusFilter}
            onChange={(event) =>
              setStatusFilter(event.target.value)
            }
            className="employee-status-filter"
            aria-label={text.allStatuses}
          >
            <option value="all">
              {text.allStatuses}
            </option>
            <option value="active">
              {text.active}
            </option>
            <option value="inactive">
              {text.inactive}
            </option>
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
            {text.loading}
          </div>
        ) : error ? null : filteredEmployees.length === 0 ? (
          <div className="employee-empty-state">
            <Users size={30} aria-hidden="true" />
            <h3>{text.emptyTitle}</h3>
            <p>{text.emptyDescription}</p>
          </div>
        ) : (
          <div className="employee-table-wrapper">
            <table className="employee-table">
              <thead>
                <tr>
                  <th>{text.columns.employee}</th>
                  <th>{text.columns.position}</th>
                  <th>{text.columns.experience}</th>
                  <th>{text.columns.status}</th>
                  <th aria-label={text.columns.actions} />
                </tr>
              </thead>

              <tbody>
                {filteredEmployees.map((employee) => {
                  const employeeName =
                    employee.full_name ||
                    text.unnamedEmployee;

                  const hasExperience =
                    employee.experience_years !== null &&
                    employee.experience_years !== undefined;

                  return (
                    <tr key={employee.id}>
                      <td>
                        <div className="employee-identity">
                          <div className="employee-avatar">
                            {employee.full_name
                              ?.charAt(0)
                              .toUpperCase() ||
                              text.employeeInitial}
                          </div>

                          <div>
                            <strong>{employeeName}</strong>

                            <span>
                              {employee.employee_code ||
                                employee.email ||
                                text.noCode}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td>
                        {employee.position_text || '—'}
                      </td>

                      <td>
                        {hasExperience
                          ? `${employee.experience_years} ${text.years}`
                          : '—'}
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
                            ? text.active
                            : text.inactive}
                        </span>
                      </td>

                      <td>
                        {/* tạm khóa nút */}
                        <button
                          type="button"
                          className="employee-action-button"
                          aria-label={text.actionsFor.replace(
                            '{name}',
                            employeeName
                          )}
                          disabled
                        >
                          <MoreVertical
                            size={18}
                            aria-hidden="true"
                          />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
};

export default AdminEmployees;