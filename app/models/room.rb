class Room < ActiveRecord::Base
  
  # Retrieve rooms created within the last two hours except user's room
  def self.rooms(session_id)
    opConfig = YAML::load(File.open("#{Rails.root.to_s}/config/opentok.yaml"))
    @config = opConfig["production"]
    @opentok = OpenTok::OpenTokSDK.new @config["api_key"], @config["api_secret"]
    now = Time.now
    self.where(:created_at => (now - 2.hours)..now).
         where(['"sessionId" != ?', session_id]).
         collect do |r| 
           { :sessionId => r.sessionId, 
             :token => self.token(r.sessionId),
             :time => r.created_at.to_i * 1000 }
         end
  end

  # Assign a room to the user.  Assignment is based on whether an OpenTok Session ID is already present in the params (URL parameter), whether a Request ID is in the params.  If a Session ID is in the params, assign that Session ID to the user.  If a Request ID is present in the params, look up the Session ID by using Facebook's API, and then assign that Session ID to the user.  If no Session ID or Request ID are in the params, then create a new room with a new Session ID, and assign that Session ID to the user.  Each room requires both a Session ID and a Token value, both needed to interact with the OpenTok API.   
  # Returns: room = { :sessionId => sessionId, :token => token }
  def self.assign( params, ip, rest_graph )
    # p "@testing"
    # p @testing
    
    # @medata = rest_graph.get('838927655093')
    # p "@medata in room model"
    # p @medata
    
    @rest_graph = rest_graph
    @params = params
    @ip = ip
    
    room  
  end
  
  private
  
  # Select a room for this user. Retrieve OpenTok configuration data.  Select an OpenTok Session ID. Determine a token for this session ID. Return the room.
  def self.room
    opConfig = YAML::load(File.open("#{Rails.root.to_s}/config/opentok.yaml"))
    @config = opConfig["production"]
    @opentok = OpenTok::OpenTokSDK.new @config["api_key"], @config["api_secret"]
    @fbConfig = \
              YAML::load(File.open("#{Rails.root.to_s}/config/rest-graph.yaml"))
              
    sessionId = selectSessionId

    token = token sessionId

    room = {  :sessionId => sessionId, :token => token, 
              :config => @config, :fbConfig => @fbConfig,
              :sutalkLink => sutalkLink( sessionId ) 
           }    

  end

  # Create SUtalk link with corresponding OpenTok Session ID.
  def self.sutalkLink( sessionId )
    
    "http://apps.facebook.com/" + \
                        "#{@fbConfig["production"]["canvas"]}/?sid=#{sessionId}"
  end
  
  # Select a Session ID.
  def self.selectSessionId
    if sessionId?
      return @params[:sid]
    elsif requestId?
      # @params[:request_ids] # convert this into session id using Facebook api
      # Look up request id and retrieve the Session ID stored in the data field.
      # Use Facebook API for this operation. Hence, user is joining an existing
      # room
      
      request = @rest_graph.get(@params[:request_ids])
      session_id = request["data"]
    else
      return createNewRoom  
    end
  end

  # Create new Room. Create a new OpenTok session.  
  # Retrieve the Session ID and store 
  # it's value in the SUtalk database, the Room model.
  def self.createNewRoom
    sessionId = createOpenTokSession 
    Room.create!( :sessionId => sessionId )      
    sessionId
  end
  
  # Is a Session ID present in the URL?  Return tue if yes.
  def self.sessionId?
    @params[:sid].present?
  end
  
  # Is a Request ID present in the URL?  Return tue if yes.
  def self.requestId?
    @params[:request_ids].present? && @params[:sid].blank?
  end
  
  # Create an OpenTok Session ID.
  def self.createOpenTokSession
    @opentok.api_url = @config["api_url"]               
    session = @opentok.create_session(@ip, \
            OpenTok::SessionPropertyConstants::ECHOSUPPRESSION_ENABLED=>"true")
    session.session_id
  end
  
  # Provide an OpenTok Token.
  def self.token( sessionId )
    @opentok.generate_token :session_id => sessionId 
  end
  
end
