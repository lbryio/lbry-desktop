import React, { useState, useEffect } from 'react';
import Loading from 'component/loading';
import Tooltip from 'component/tooltip';
import Progress from 'component/progress';
import Breadcrumb from 'component/breadcrumb';
import FloatingActionButton from 'component/floatingActionButton';
import Skeleton from 'component/skeleton';
import NotificationManager from 'component/notificationManager';
import * as ICONS from 'constants/icons';

function TestComponents() {
  const [progressValue, setProgressValue] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  // Simulate progress
  useEffect(() => {
    const interval = setInterval(() => {
      setProgressValue((prev) => (prev >= 100 ? 0 : prev + 1));
    }, 100);
    return () => clearInterval(interval);
  }, []);

  // Simulate loading states
  useEffect(() => {
    const interval = setInterval(() => {
      setIsLoading((prev) => !prev);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleShowNotification = (type) => {
    // This would integrate with the notification system
    console.log(`Showing ${type} notification`);
    setShowNotifications(true);
    setTimeout(() => setShowNotifications(false), 3000);
  };

  const breadcrumbItems = [
    { label: 'Discover', path: '/discover', icon: ICONS.DISCOVER },
    { label: 'Technology', path: '/discover/technology', icon: ICONS.TAG },
    { label: 'Programming', path: '/discover/technology/programming' },
  ];

  return (
    <div className="test-components">
      <h1>Enhanced UI Components Test</h1>

      {/* Loading Components Test */}
      <section className="test-section">
        <h2>Loading Components</h2>
        <div className="test-grid">
          <div className="test-item">
            <h3>Spinner</h3>
            <Loading type="spinner" text="Loading..." />
          </div>
          <div className="test-item">
            <h3>Dots</h3>
            <Loading type="dots" text="Processing..." />
          </div>
          <div className="test-item">
            <h3>Pulse</h3>
            <Loading type="pulse" text="Please wait..." />
          </div>
          <div className="test-item">
            <h3>Skeleton</h3>
            <Skeleton type="card" />
          </div>
          <div className="test-item">
            <h3>Full Screen Loading</h3>
            {isLoading && <Loading type="spinner" fullScreen text="Loading application..." />}
          </div>
        </div>
      </section>

      {/* Progress Bars Test */}
      <section className="test-section">
        <h2>Progress Bars</h2>
        <div className="test-grid">
          <div className="test-item">
            <h3>Default Progress</h3>
            <Progress value={progressValue} showLabel />
          </div>
          <div className="test-item">
            <h3>Animated Progress</h3>
            <Progress value={progressValue} animated showLabel />
          </div>
          <div className="test-item">
            <h3>Success Progress</h3>
            <Progress value={100} variant="success" showLabel />
          </div>
          <div className="test-item">
            <h3>Warning Progress</h3>
            <Progress value={75} variant="warning" showLabel />
          </div>
          <div className="test-item">
            <h3>Error Progress</h3>
            <Progress value={25} variant="error" showLabel />
          </div>
        </div>
      </section>

      {/* Tooltips Test */}
      <section className="test-section">
        <h2>Tooltips</h2>
        <div className="test-grid">
          <div className="test-item">
            <Tooltip content="This is a helpful tooltip!">
              <button className="button button--primary">Hover for Tooltip</button>
            </Tooltip>
          </div>
          <div className="test-item">
            <Tooltip content="Tooltip on the right" position="right">
              <button className="button button--secondary">Right Tooltip</button>
            </Tooltip>
          </div>
          <div className="test-item">
            <Tooltip content="Tooltip on the bottom" position="bottom">
              <button className="button button--primary">Bottom Tooltip</button>
            </Tooltip>
          </div>
        </div>
      </section>

      {/* Breadcrumb Test */}
      <section className="test-section">
        <h2>Breadcrumb Navigation</h2>
        <Breadcrumb items={breadcrumbItems} />
      </section>

      {/* Enhanced Buttons Test */}
      <section className="test-section">
        <h2>Enhanced Buttons</h2>
        <div className="test-grid">
          <div className="test-item">
            <button className="button button--primary">Primary Button</button>
          </div>
          <div className="test-item">
            <button className="button button--secondary">Secondary Button</button>
          </div>
          <div className="test-item">
            <button className="button button--primary" disabled>
              Disabled Button
            </button>
          </div>
        </div>
      </section>

      {/* Interactive Cards Test */}
      <section className="test-section">
        <h2>Interactive Cards</h2>
        <div className="test-grid">
          <div className="card">
            <h3>Test Card 1</h3>
            <p>This card should have hover effects and smooth animations.</p>
            <button className="button button--primary">Action</button>
          </div>
          <div className="card">
            <h3>Test Card 2</h3>
            <p>Hover over this card to see the elevation effect.</p>
            <button className="button button--secondary">Learn More</button>
          </div>
        </div>
      </section>

      {/* Notification Test */}
      <section className="test-section">
        <h2>Notification System</h2>
        <div className="test-grid">
          <div className="test-item">
            <button className="button button--primary" onClick={() => handleShowNotification('success')}>
              Show Success
            </button>
          </div>
          <div className="test-item">
            <button className="button button--secondary" onClick={() => handleShowNotification('error')}>
              Show Error
            </button>
          </div>
          <div className="test-item">
            <button className="button button--secondary" onClick={() => handleShowNotification('warning')}>
              Show Warning
            </button>
          </div>
        </div>
      </section>

      {/* Floating Action Button Test */}
      <FloatingActionButton
        icon={ICONS.ADD}
        label="Add Content"
        tooltip="Create new content"
        onClick={() => handleShowNotification('info')}
      />

      {/* Notification Manager */}
      {showNotifications && <NotificationManager />}
    </div>
  );
}

export default TestComponents;
