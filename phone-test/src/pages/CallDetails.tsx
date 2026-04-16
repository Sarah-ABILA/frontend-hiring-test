import { useQuery, useMutation } from '@apollo/client';
import { useNavigate, useParams } from 'react-router-dom';
import { GET_CALL_DETAILS } from '../gql/queries';
import { ARCHIVE_CALL, ADD_NOTE } from '../gql/mutations';
import { formatDate, formatDuration } from '../helpers/dates';
import { useState } from 'react';

const getBadgeStyle = (callType: string) => {
  if (callType === 'answered') return { background: '#e0f5e0', color: '#2d7a2d' };
  if (callType === 'missed') return { background: '#ffe0e0', color: '#c0392b' };
  return { background: '#f0f0f0', color: '#777' };
};

export const CallDetailsPage = () => {
  const { callId } = useParams();
  const navigate = useNavigate();
  const [noteText, setNoteText] = useState('');
  const [addingNote, setAddingNote] = useState(false);

  const { loading, error, data } = useQuery(GET_CALL_DETAILS, {
    variables: { id: callId }
  });

  const [archiveCall, { loading: archiving }] = useMutation(ARCHIVE_CALL, {
    refetchQueries: [{ query: GET_CALL_DETAILS, variables: { id: callId } }]
  });

  const [addNote, { loading: savingNote }] = useMutation(ADD_NOTE, {
    refetchQueries: [{ query: GET_CALL_DETAILS, variables: { id: callId } }],
    onCompleted: () => {
      setNoteText('');
      setAddingNote(false);
    }
  });

  if (loading) return <p style={{ padding: '24px', textAlign: 'center' }}>Loading...</p>;
  if (error) return <p style={{ padding: '24px', textAlign: 'center', color: '#c0392b' }}>Une erreur est survenue.</p>;
  if (!data) return <p style={{ padding: '24px', textAlign: 'center' }}>Not found</p>;

  const call = data.call;
  const badgeStyle = getBadgeStyle(call.call_type);
  const directionSymbol = call.direction === 'inbound' ? '↙' : '↗';
  const iconBg = call.call_type === 'answered' ? '#e0f5e0' : call.call_type === 'missed' ? '#ffe0e0' : '#f0f0f0';
  const iconColor = call.call_type === 'answered' ? '#2d7a2d' : call.call_type === 'missed' ? '#c0392b' : '#888';

  const handleArchive = () => {
    archiveCall({ variables: { id: callId } });
  };

  const handleAddNote = () => {
    if (!noteText.trim()) return;
    addNote({
      variables: {
        input: {
          activityId: callId,
          content: noteText.trim()
        }
      }
    });
  };

  return (
    <div>
      <button
        onClick={() => navigate('/calls')}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          color: '#555',
          fontSize: '14px',
          marginBottom: '20px',
          padding: '0'
        }}
      >
        ← Back to calls
      </button>

      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: '16px',
        border: '1px solid #efefef',
        boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
        overflow: 'hidden'
      }}>
        {/* Header */}
        <div style={{
          padding: '24px',
          borderBottom: '1px solid #f5f5f5',
          display: 'flex',
          alignItems: 'center',
          gap: '16px'
        }}>
          <div style={{
            width: '56px',
            height: '56px',
            borderRadius: '50%',
            backgroundColor: iconBg,
            color: iconColor,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '24px',
            flexShrink: 0
          }}>
            {directionSymbol}
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
              <span style={{ fontSize: '20px', fontWeight: 700, color: '#1a1a1a' }}>
                {call.direction === 'inbound' ? call.from : call.to}
              </span>
              <span style={{
                fontSize: '12px',
                padding: '3px 10px',
                borderRadius: '10px',
                fontWeight: 500,
                ...badgeStyle
              }}>
                {call.call_type}
              </span>
            </div>
            <span style={{ fontSize: '13px', color: '#999' }}>
              {call.direction === 'inbound' ? 'Inbound' : 'Outbound'} · {formatDate(call.created_at)}
            </span>
          </div>
        </div>

        {/* Details */}
        <div style={{ padding: '24px', borderBottom: '1px solid #f5f5f5' }}>
          <h3 style={{
            fontSize: '13px',
            fontWeight: 600,
            color: '#999',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            marginBottom: '16px'
          }}>
            Call details
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            {[
              { label: 'From', value: call.from },
              { label: 'To', value: call.to },
              { label: 'Via', value: call.via },
              { label: 'Duration', value: formatDuration(call.duration / 1000) },
              { label: 'Date', value: formatDate(call.created_at) },
              { label: 'Direction', value: call.direction },
              { label: 'Status', value: call.is_archived ? '📦 Archived' : '✅ Active' },
            ].map(({ label, value }) => (
              <div key={label}>
                <div style={{ fontSize: '12px', color: '#aaa', marginBottom: '2px' }}>{label}</div>
                <div style={{ fontSize: '14px', fontWeight: 500, color: '#1a1a1a' }}>{value}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Notes */}
        <div style={{ padding: '24px', borderBottom: '1px solid #f5f5f5' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <h3 style={{
              fontSize: '13px',
              fontWeight: 600,
              color: '#999',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              margin: 0
            }}>
              Notes {call.notes?.length > 0 && `(${call.notes.length})`}
            </h3>
            <button
              onClick={() => setAddingNote(!addingNote)}
              style={{
                fontSize: '12px',
                padding: '5px 12px',
                borderRadius: '8px',
                border: '1px solid #00B388',
                backgroundColor: addingNote ? '#00B388' : 'white',
                color: addingNote ? 'white' : '#00B388',
                cursor: 'pointer',
                fontWeight: 500
              }}
            >
              {addingNote ? '✕ Cancel' : '+ Add note'}
            </button>
          </div>

          {addingNote && (
            <div style={{ marginBottom: '16px' }}>
              <textarea
                value={noteText}
                onChange={e => setNoteText(e.target.value)}
                placeholder="Write your note here..."
                rows={3}
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  border: '1.5px solid #e0e0e0',
                  borderRadius: '8px',
                  fontSize: '14px',
                  outline: 'none',
                  boxSizing: 'border-box',
                  resize: 'vertical',
                  fontFamily: 'inherit',
                  marginBottom: '10px'
                }}
                onFocus={e => e.target.style.borderColor = '#00B388'}
                onBlur={e => e.target.style.borderColor = '#e0e0e0'}
              />
              <button
                onClick={handleAddNote}
                disabled={savingNote || !noteText.trim()}
                style={{
                  padding: '8px 20px',
                  borderRadius: '8px',
                  border: 'none',
                  backgroundColor: savingNote || !noteText.trim() ? '#ccc' : '#00B388',
                  color: 'white',
                  fontSize: '13px',
                  fontWeight: 600,
                  cursor: savingNote || !noteText.trim() ? 'not-allowed' : 'pointer'
                }}
              >
                {savingNote ? 'Saving...' : 'Save note'}
              </button>
            </div>
          )}

          {call.notes && call.notes.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {call.notes.map((note: any, index: number) => (
                <div key={index} style={{
                  backgroundColor: '#fafafa',
                  borderRadius: '8px',
                  padding: '12px 14px',
                  border: '1px solid #f0f0f0',
                  borderLeft: '3px solid #00B388',
                  fontSize: '14px',
                  color: '#444',
                  lineHeight: '1.5'
                }}>
                  {note.content}
                </div>
              ))}
            </div>
          ) : (
            !addingNote && (
              <p style={{ fontSize: '13px', color: '#bbb', textAlign: 'center', padding: '16px 0' }}>
                No notes yet. Click "Add note" to add one.
              </p>
            )
          )}
        </div>

        {/* Actions */}
        <div style={{ padding: '20px 24px', display: 'flex', justifyContent: 'flex-end' }}>
          <button
            onClick={handleArchive}
            disabled={archiving}
            style={{
              padding: '10px 20px',
              borderRadius: '8px',
              border: '1px solid #e0e0e0',
              backgroundColor: call.is_archived ? '#fff3e0' : 'white',
              color: call.is_archived ? '#e65100' : '#555',
              fontSize: '14px',
              cursor: archiving ? 'not-allowed' : 'pointer',
              fontWeight: 500,
              opacity: archiving ? 0.6 : 1
            }}
          >
            {archiving ? 'Loading...' : call.is_archived ? '📤 Unarchive' : '📥 Archive'}
          </button>
        </div>
      </div>
    </div>
  );
};
