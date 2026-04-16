import { useQuery } from '@apollo/client';
import { PAGINATED_CALLS } from '../gql/queries';
import { Pagination } from '@aircall/tractor';
import { formatDate, formatDuration } from '../helpers/dates';
import { useNavigate, useSearchParams } from 'react-router-dom';
import styled from 'styled-components';
import { useState } from 'react';

export const PaginationWrapper = styled.div`
  > div {
    width: inherit;
    margin-top: 20px;
    display: flex;
    justify-content: center;
  }
`;

const CALLS_PER_PAGE = 5;

const getBadgeStyle = (callType: string) => {
  if (callType === 'answered') return { background: '#e0f5e0', color: '#2d7a2d' };
  if (callType === 'missed') return { background: '#ffe0e0', color: '#c0392b' };
  return { background: '#f0f0f0', color: '#777' };
};

const getIconStyle = (callType: string) => {
  if (callType === 'answered') return { background: '#e0f5e0', color: '#2d7a2d' };
  if (callType === 'missed') return { background: '#ffe0e0', color: '#c0392b' };
  return { background: '#f0f0f0', color: '#888' };
};

const getBorderColor = (callType: string) => {
  if (callType === 'answered') return '#00B388';
  if (callType === 'missed') return '#e74c3c';
  return '#95a5a6';
};

type FilterType = 'all' | 'answered' | 'missed' | 'voicemail';
type DirectionFilter = 'all' | 'inbound' | 'outbound';

export const CallsListPage = () => {
  const [search] = useSearchParams();
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [directionFilter, setDirectionFilter] = useState<DirectionFilter>('all');
  const pageQueryParams = search.get('page');
  const activePage = !!pageQueryParams ? parseInt(pageQueryParams) : 1;

  const { loading, error, data } = useQuery(PAGINATED_CALLS, {
    variables: {
      offset: (activePage - 1) * CALLS_PER_PAGE,
      limit: CALLS_PER_PAGE
    }
  });

  if (loading) return <p style={{ padding: '24px', textAlign: 'center' }}>Loading calls...</p>;
  if (error) return <p style={{ padding: '24px', textAlign: 'center', color: '#c0392b' }}>Une erreur est survenue. Veuillez réessayer.</p>;
  if (!data) return <p style={{ padding: '24px', textAlign: 'center' }}>Not found</p>;

  const { totalCount, nodes: calls } = data.paginatedCalls;

  const filteredCalls = calls.filter((call: Call) => {
    const typeMatch = activeFilter === 'all' || call.call_type === activeFilter;
    const directionMatch = directionFilter === 'all' || call.direction === directionFilter;
    return typeMatch && directionMatch;
  });

  const handleCallOnClick = (callId: string) => {
    navigate(`/calls/${callId}`);
  };

  const handlePageChange = (page: number) => {
    navigate(`/calls/?page=${page}`);
  };

  const filterButtons: { label: string; value: FilterType }[] = [
    { label: 'All', value: 'all' },
    { label: 'Answered', value: 'answered' },
    { label: 'Missed', value: 'missed' },
    { label: 'Voicemail', value: 'voicemail' },
  ];

  const directionButtons: { label: string; value: DirectionFilter }[] = [
    { label: 'All directions', value: 'all' },
    { label: 'Inbound', value: 'inbound' },
    { label: 'Outbound', value: 'outbound' },
  ];

  return (
    <div>
      <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#1a1a1a', marginBottom: '4px' }}>
        Calls History
      </h1>
      <p style={{ fontSize: '13px', color: '#888', marginBottom: '20px' }}>
        Your recent call activity
      </p>

      <div style={{ display: 'flex', gap: '8px', marginBottom: '10px', flexWrap: 'wrap' }}>
        {filterButtons.map(({ label, value }) => (
          <button
            key={value}
            onClick={() => setActiveFilter(value)}
            style={{
              fontSize: '12px',
              padding: '6px 14px',
              borderRadius: '20px',
              border: activeFilter === value ? 'none' : '1px solid #e0e0e0',
              backgroundColor: activeFilter === value ? '#00B388' : 'white',
              color: activeFilter === value ? 'white' : '#555',
              cursor: 'pointer',
              fontWeight: activeFilter === value ? 600 : 400
            }}
          >
            {label}
          </button>
        ))}
      </div>

      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', flexWrap: 'wrap' }}>
        {directionButtons.map(({ label, value }) => (
          <button
            key={value}
            onClick={() => setDirectionFilter(value)}
            style={{
              fontSize: '12px',
              padding: '6px 14px',
              borderRadius: '20px',
              border: directionFilter === value ? 'none' : '1px solid #e0e0e0',
              backgroundColor: directionFilter === value ? '#1a1a1a' : 'white',
              color: directionFilter === value ? 'white' : '#555',
              cursor: 'pointer',
              fontWeight: directionFilter === value ? 600 : 400
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {filteredCalls.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '40px',
          color: '#aaa',
          fontSize: '14px',
          backgroundColor: 'white',
          borderRadius: '12px',
          border: '1px solid #efefef'
        }}>
          No calls found for this filter.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {filteredCalls.map((call: Call) => {
            const duration = formatDuration(call.duration / 1000);
            const date = formatDate(call.created_at);
            const notes = call.notes ? `${call.notes.length} note${call.notes.length > 1 ? 's' : ''}` : null;
            const badgeStyle = getBadgeStyle(call.call_type);
            const iconStyle = getIconStyle(call.call_type);
            const borderColor = getBorderColor(call.call_type);
            const directionSymbol = call.direction === 'inbound' ? '↙' : '↗';
            const timeString = call.created_at
              ? new Date(call.created_at).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
              : '';

            return (
              <div
                key={call.id}
                onClick={() => handleCallOnClick(call.id)}
                style={{
                  backgroundColor: '#ffffff',
                  borderRadius: '12px',
                  border: '1px solid #efefef',
                  borderLeft: `4px solid ${borderColor}`,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.07)',
                  cursor: 'pointer',
                  overflow: 'hidden'
                }}
                onMouseEnter={e => (e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.13)')}
                onMouseLeave={e => (e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.07)')}
              >
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '44px 1fr auto',
                  gap: '12px',
                  alignItems: 'center',
                  padding: '14px 16px',
                  borderBottom: notes ? '1px solid #f5f5f5' : 'none'
                }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '18px',
                    flexShrink: 0,
                    ...iconStyle
                  }}>
                    {directionSymbol}
                  </div>

                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '3px' }}>
                      <span style={{ fontSize: '14px', fontWeight: 600, color: '#1a1a1a' }}>
                        {call.direction === 'inbound' ? call.from : call.to}
                      </span>
                      <span style={{
                        fontSize: '11px',
                        padding: '2px 8px',
                        borderRadius: '10px',
                        fontWeight: 500,
                        ...badgeStyle
                      }}>
                        {call.call_type}
                      </span>
                    </div>
                    <span style={{ fontSize: '12px', color: '#999' }}>
                      {call.direction === 'inbound' ? 'Inbound' : 'Outbound'} · {date}
                    </span>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '14px', fontWeight: 600, color: '#1a1a1a' }}>{duration}</div>
                    <div style={{ fontSize: '11px', color: '#999', marginTop: '2px' }}>{timeString}</div>
                  </div>
                </div>

                {notes && (
                  <div style={{
                    padding: '8px 16px',
                    backgroundColor: '#fafafa',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}>
                    <span style={{ fontSize: '12px' }}>📝</span>
                    <span style={{ fontSize: '12px', color: '#888' }}>{notes}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {totalCount && (
        <PaginationWrapper>
          <Pagination
            activePage={activePage}
            pageSize={CALLS_PER_PAGE}
            onPageChange={handlePageChange}
            recordsTotalCount={totalCount}
          />
        </PaginationWrapper>
      )}
    </div>
  );
};
